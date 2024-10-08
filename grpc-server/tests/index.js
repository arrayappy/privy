import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { promisify } from "util";

// Load the proto file
const packageDefinition = protoLoader.loadSync("../proto/privy.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const privyProto = grpc.loadPackageDefinition(packageDefinition).privy;

// Create a client instance
const client = new privyProto.PrivyService(
  "0.0.0.0:3000".parse().unwrap(),
  grpc.credentials.createInsecure()
);

// Promisify the methods
const CreateUser = promisify(client.CreateUser).bind(client);
const UpdateUser = promisify(client.UpdateUser).bind(client);
const DeleteUser = promisify(client.DeleteUser).bind(client);
const GetUser = promisify(client.GetUser).bind(client);
const InsertMessage = promisify(client.InsertMessage).bind(client);
const CheckUsernameExist = promisify(client.CheckUsernameExist).bind(client);

// Test all the methods
(async () => {
  try {
    // Test CreateUser
    const userAddr = "tesQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr";
    const oldUsername = "oldTest";
    const newUsername = "newTest";
    const password_salt = "password_salt";

    // const createUserResponse = await CreateUser({
    //   user_addr: userAddr,
    //   user_name: oldUsername,
    //   password_salt: password_salt
    // });
    // console.log("CreateUser Response:", createUserResponse);

    // Test GetUserByAddr
    // const getUserByAddrResponse = await GetUserByAddr({
    //   user_addr: userAddr,
    // });
    // console.log("GetUserByAddr Response:", getUserByAddrResponse);

    // // Test UpdateUser
    // const updateUserResponse = await UpdateUser({
    //   user_addr: userAddr,
    //   user_name: newUsername,
    //   password_salt: password_salt,
    // });
    // console.log("UpdateUser Response:", updateUserResponse);

    // // Test GetUserByName
    // const getUserByNameResponse = await GetUserByName({
    //   user_name: newUsername,
    // });
    // console.log("GetUserByName Response:", getUserByNameResponse);

    // // Test DeleteUser
    // const deleteUserResponse = await DeleteUser({
    //   user_addr: userAddr,
    // });
    // console.log("DeleteUser Response:", deleteUserResponse);

    // const insertMessageResponse = await InsertMessage({
    //   user_addr: userAddr,
    //   encrypted_msg: "hey1",
    //   fingerprint_id: "finger01",
    //   cat_idx: 0,
    //   passkey: "cat_secret",
    // });
    // console.log(insertMessageResponse);

    // const getUserResponse = await GetUser({
    //   user_name: newUsername,
    //   cat_idx: 0,
    //   fingerprint_id: "finger01",
    // });
    // console.log(getUserResponse);

    // const checkUsernameExist = await CheckUsernameExist({
    //   user_name: newUsername
    // })
    // console.log(checkUsernameExist)
  } catch (err) {
    console.error("Error:", err);
  }
})();
