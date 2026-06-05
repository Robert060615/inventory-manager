## Traceability
Test cases are derived from requirements, which are derived from user flows:

```text
UF-1 Manage inventory               (Design)
  └─ BR-1 Product CRUD               (Requirements)
       ├─ TC1.1 Add a new product
       ├─ TC1.2 Edit a product
       └─ TC1.3 Delete a product

UF-2 View change history            (Design)
  └─ BR-2 Change history log         (Requirements)
       ├─ TC2.1 Change is logged on edit
       ├─ TC2.2 History shows correct old and new values
       └─ TC2.3 Filter history by product

UF-3 Undo a change                  (Design)
  └─ BR-3 Undo function              (Requirements)
       ├─ TC3.1 Undo a product edit
       └─ TC3.2 Undo a product deletion

UF-4 Invite a new user              (Design)
  └─ BR-4 Access control             (Requirements)
       ├─ TC4.1 Invite a new user by email
       ├─ TC4.2 Invited user can set password and log in
       └─ TC4.3 Uninvited user cannot access the system
```

A user flow describes *what the user does*. A requirement formalises *what the system must support*. A test case verifies *that it actually works* with specific input and expected output.

---

## Test plan
*Brief description of the testing strategy - what will be tested, how, and with what tools.*

> **Note:** Testing tools were updated during iteration 6. Jest/Supertest was replaced with Vitest. Nginx was replaced with Vercel for deployment.

| Aspect | Description |
|---|---|
| Testing tools | Browser (Chrome/Firefox), Jest, Supertest |
| Automated testing | Planned for iteration 6 — Jest for unit tests, Supertest for route/integration tests |
| Manual testing | Yes - all test cases are executed manually by following the steps in the browser |
| Untested parts | Nginx/HTTPS configuration, seed script |

## Test suites
Coverage matrix - which requirements does each test cover?

| Test | BR-1 | BR-2 | BR-3 | BR-4 |
|---|---|---|---|---|
| TC1.1 | ✓ | | | |
| TC1.2 | ✓ | | | |
| TC1.3 | ✓ | | | |
| TC2.1 | | ✓ | | |
| TC2.2 | | ✓ | | |
| TC2.3 | | ✓ | | |
| TC3.1 | | | ✓ | |
| TC3.2 | | | ✓ | |
| TC4.1 | | | | ✓ |
| TC4.2 | | | | ✓ |
| TC4.3 | | | | ✓ |
| **Coverage** | 3 cases | 3 cases | 2 cases | 3 cases |

## Test cases

### TC1.1 Add a new product
**Requirement:** BR-1
**Precondition:** User is logged in. No product named "Overall Röd M" exists.

> **Note:** In the current implementation, overalls do not have a custom name since SPIIK only has one type of overall. The name is set automatically based on category. This test case was written before that decision was made.

#### Steps
1. Navigate to the product list page
2. Click **Add product**
3. Enter "Overall Röd" as name, "Overall" as category, "M" as size, "10" as quantity
4. Click **Save**

#### Expected result
- User is redirected to the product list
- "Overall Röd M" appears in the list with quantity 10

---

### TC1.2 Edit a product
**Requirement:** BR-1
**Precondition:** User is logged in. Product "Overall Röd M" exists with quantity 10.

> **Note:** Same as TC1.1 — the product name for overalls is not editable in the current implementation. The test still verifies that quantity can be updated.

#### Steps
1. Navigate to the product list page
2. Click **Edit** on "Overall Röd M"
3. Change quantity from "10" to "8"
4. Click **Save**

#### Expected result
- User is redirected to the product list
- "Overall Röd M" now shows quantity 8

---

### TC1.3 Delete a product
**Requirement:** BR-1
**Precondition:** User is logged in. Product "Overall Röd M" exists.

> **Note:** Same as TC1.1 — product name for overalls differs in current implementation.

#### Steps
1. Navigate to the product list page
2. Click **Delete** on "Overall Röd M"
3. Confirm the deletion

#### Expected result
- User is redirected to the product list
- "Overall Röd M" is no longer in the list

---

### TC2.1 Change is logged on edit
**Requirement:** BR-2
**Precondition:** User is logged in. Product "Overall Röd M" exists with quantity 10.

> **Note:** Same as TC1.1 — product name for overalls differs in current implementation.

#### Steps
1. Edit "Overall Röd M" and change quantity to 8
2. Navigate to the history for "Overall Röd M"

#### Expected result
- History shows an entry with the logged-in user's email, timestamp, field "quantity", old value "10" and new value "8"

---

### TC2.2 History shows correct old and new values
**Requirement:** BR-2
**Precondition:** User is logged in. Product "SPIIK-tröja" exists with category "Tröja".

#### Steps
1. Edit "SPIIK-tröja" and change category to "Merch"
2. Navigate to the history for "SPIIK-tröja"

#### Expected result
- History shows field "category", old value "Tröja", new value "Merch"

---

### TC2.3 Filter history by product
**Requirement:** BR-2
**Precondition:** User is logged in. Multiple products exist with change history.

#### Steps
1. Navigate to the history page
2. Filter by product "Overall Röd M"

#### Expected result
- Only changes related to "Overall Röd M" are displayed

---

### TC3.1 Undo a product edit
**Requirement:** BR-3
**Precondition:** User is logged in. Product "Overall Röd M" was edited from quantity 10 to 8.

> **Note:** Same as TC1.1 — product name for overalls differs in current implementation.

#### Steps
1. Navigate to the history for "Overall Röd M"
2. Click **Undo** on the quantity change entry

#### Expected result
- Quantity for "Overall Röd M" is restored to 10
- A new history entry is logged for the undo action

---

### TC3.2 Undo a product deletion
**Requirement:** BR-3
**Precondition:** User is logged in. Product "Märke LAN 2025" was deleted.

#### Steps
1. Navigate to the history page
2. Find the deletion entry for "Märke LAN 2025"
3. Click **Undo**

#### Expected result
- "Märke LAN 2025" is recreated with its previous values
- The product appears in the product list again

---

### TC4.1 Invite a new user by email
**Requirement:** BR-4
**Precondition:** User is logged in. No account exists for sexmaster@spiik.se.

#### Steps
1. Navigate to the invite page
2. Enter "sexmaster@spiik.se" in the email field
3. Click **Invite**

#### Expected result
- A confirmation message is shown
- An invite link is generated for sexmaster@spiik.se

---

### TC4.2 Invited user can set password and log in
**Requirement:** BR-4
**Precondition:** An invite link has been generated for sexmaster@spiik.se.

#### Steps
1. Open the invite link in a browser
2. Enter "MinSecretPassword1" as password
3. Click **Create account**
4. Log in with sexmaster@spiik.se and "MinSecretPassword1"

#### Expected result
- Account is created successfully
- User is redirected to the dashboard after login

---

### TC4.3 Uninvited user cannot access the system
**Requirement:** BR-4
**Precondition:** No account or invite exists for random@example.com.

#### Steps
1. Navigate to the login page
2. Enter "random@example.com" and "password123"
3. Click **Log in**

#### Expected result
- Login is rejected
- An error message is shown
- No access to the dashboard