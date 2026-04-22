# Security Specification for Aether Finance

## 1. Data Invariants
- A category must have a non-empty name and belong to a valid user.
- A transaction must belong to a valid user.
- Transaction amount must be a number.
- `userId` must match the authenticated user's UID.
- `createdAt` must be set to the server timestamp during creation and remain immutable.

## 2. The Dirty Dozen Payloads (Rejection Targets)

1. **Identity Spoofing**: Creating a category with another user's `userId`.
2. **Ghost Category**: Creating a category without a `userId`.
3. **Empty Name**: Creating a category with an empty string as a name.
4. **Huge Category ID**: Using a 2KB string as a category ID.
5. **Malicious Transaction ID**: Injecting scripts into the transaction document ID.
6. **Immortal Update**: Attempting to change the `createdAt` timestamp of a transaction.
7. **Cross-User Read**: Trying to list categories belonging to another UID.
8. **Invalid Amount**: Sending a transaction where `amount` is a string or boolean.
9. **Missing Required Field**: Creating a transaction without a `description`.
10. **State Poisoning**: Creating a transaction with an unknown `type` (not expense or income).
11. **Future Timestamp Spoofing**: Setting `createdAt` to a future date instead of `request.time`.
12. **Shadow Field injection**: Adding `isVerified: true` to a category document.

## 3. Test Runner Concept
Verify that all operations where `request.auth.uid != resource.data.userId` return `PERMISSION_DENIED`.
Verify that `request.resource.data.keys().hasOnly(...)` ensures no shadow fields.
