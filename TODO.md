## CHECKLIST

### Program Instructions
- [x]  Initialize privy config
- [x]  Update privy config
- [ ]  Withdraw main balance
- [x]  Create privy user
    - [ ]  Allocate space
- [x]  Add user tokens
- [ ]  Update privy user
- [x]  Insert message to user
  
### gRPC Server
- [ ]  Add gRPC Get & Post to server
- [ ]  Add gRPC + Diesel to server
    | name | addr |
    | --- | --- |
    | naidu | 0x |
- [ ]  Add methods
  - [ ]  Get user by address
  - [ ]  Get user by username
  - [ ]  Insert message to user
- [ ]  Anchor Rust Setup + Basic Intructions
- [ ]  Anchor Rust Complete

### Frontend
- [ ]  Project inital setup
  - [ ]  solana/web3.js
  - [ ]  grpc client side code
- [ ] Work on receiver and sender UI screens
- [ ] Making API calls and complete functionality

### Finale
- [ ] Deployments
- [ ] Wrapping up!

---
## Improvements
### Category Plan - Do it before going to frontend
- [ ]  Change messages from Vec<String> to Vec of Stringified Array [catId - 1, message]
- [ ]  Add categories as Vec stringified array [cat name(24), passkey, isEnabled] - 0 index for no category
- [ ]  Update user byte space for messages and categories
- [ ]  Add create category function with catName,  passkey and isEnabled
- [ ]  Change url from [privy.com/naidu](http://privy.com/naidu) → privy.com/naidu/1

### Fingerprint Plan
- [ ]  fingerprints table
    | fingerprint | user_categories |
    | --- | --- |
    | 123 | addr_catIdx[] |
- [ ]  Program: Allow one request per user per category - add it to categories vector
- [ ]  Server: Get user_categories by fingerprint
- [ ]  Server: Create or insert addr_catIdx into fingerprint