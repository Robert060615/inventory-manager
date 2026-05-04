import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import InviteToken from '../models/InviteToken.js'

export const getInvite = (req, res) => {
  const error = req.flash('error')[0] || null
  res.render('pages/invite/index', { title: 'Bjud in användare', error })
}

export const postInvite = async (req, res) => {
  const { email } = req.body

  if (!email || !email.trim()) {
    req.flash('error', 'E-postadress är obligatorisk.')
    return res.redirect('/invite')
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      req.flash('error', 'Det finns redan ett konto med den e-postadressen.')
      return res.redirect('/invite')
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    await InviteToken.create({
      token,
      email: email.toLowerCase().trim(),
      createdBy: res.locals.user.id,
      expiresAt
    })

    const inviteUrl = `${req.protocol}://${req.get('host')}/invite/accept/${token}`
    res.render('pages/invite/success', {
      title: 'Inbjudan skapad',
      inviteUrl,
      email: email.toLowerCase().trim()
    })
  } catch (err) {
    console.error(err)
    req.flash('error', 'Ett fel uppstod. Försök igen.')
    res.redirect('/invite')
  }
}

export const getAcceptInvite = async (req, res) => {
  const { token } = req.params
  try {
    const invite = await InviteToken.findOne({ token })
    if (!invite || invite.used || invite.expiresAt < new Date()) {
      return res.render('pages/invite/accept', {
        title: 'Ogiltig inbjudan',
        invite: null,
        error: 'Inbjudningslänken är ogiltig eller har gått ut.'
      })
    }
    const error = req.flash('error')[0] || null
    res.render('pages/invite/accept', { title: 'Skapa konto', invite, error })
  } catch (err) {
    console.error(err)
    res.render('pages/invite/accept', {
      title: 'Ogiltig inbjudan',
      invite: null,
      error: 'Ett fel uppstod.'
    })
  }
}

export const postAcceptInvite = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  if (!password || password.length < 6) {
    req.flash('error', 'Lösenordet måste vara minst 6 tecken.')
    return res.redirect(`/invite/accept/${token}`)
  }

  try {
    const invite = await InviteToken.findOne({ token })
    if (!invite || invite.used || invite.expiresAt < new Date()) {
      return res.render('pages/invite/accept', {
        title: 'Ogiltig inbjudan',
        invite: null,
        error: 'Inbjudningslänken är ogiltig eller har gått ut.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ email: invite.email, hashedPassword })
    invite.used = true
    await invite.save()

    res.redirect('/auth/login')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Ett fel uppstod. Försök igen.')
    res.redirect(`/invite/accept/${token}`)
  }
}
