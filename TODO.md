## CHECKLIST

### Program Instructions
- [x]  Initialize privy config
- [x]  Update privy config
- [x]  Withdraw main balance
- [x]  Create privy user
    - [x]  Allocate space
- [x]  Add user tokens
- [x]  Update privy user
- [x]  Insert message to user
  
### gRPC Server
- [x]  Add gRPC Get & Post to server
- [x]  Add gRPC + Diesel to server
    | name | addr |
    | --- | --- |
    | naidu | 0x |
- [x]  Add methods
  - [x]  Get user by address
  - [x]  Get user by username
- [x]  Anchor Rust Setup + Basic Intructions
- [x]  Anchor Rust Complete
  - [x]  Insert message to user
- [x] Program V2 (Category + Fingerprint)
- [x] Server V2 + Wrapup

### Frontend
- [ ] Project inital setup + cleanup
- [ ] Frontend Screens
- [ ] Frontend Wallet Connections
- [ ] Frontend APIs
- [ ] Work on receiver and sender UI screens
- [ ] Making API calls and complete functionality

### Finale
- [ ] Deployments
- [ ] README & Wrapping up!

---
## Improvements
### Category Plan - Do it before going to frontend
- [x]  Change messages from Vec<String> to Vec of Stringified Array [catId - 1, message]
- [x]  Add categories as Vec stringified array [cat name(24), passkey, isEnabled] - 0 index for no category
- [x]  Update user byte space for messages and categories
- [x]  Add create category function with catName,  passkey and isEnabled
- [x]  Change url from [privy.com/naidu](http://privy.com/naidu) → privy.com/naidu/1

### Fingerprint Plan
- [x]  fingerprints table
    | fingerprint | user_categories |
    | --- | --- |
    | 123 | addr_catIdx[] |
- [x]  Program: Allow one request per user per category - add it to categories vector
- [x]  Server: Get user_categories by fingerprint
- [x]  Server: Create or insert addr_catIdx into fingerprint

### Future
- [ ] Improve DB methods with generic traits
- [ ] Tokens based on USDC with Pyth SDK + SPL Tokens