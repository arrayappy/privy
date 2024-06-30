import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { promisify } from "util";

// Load the proto file
const packageDefinition = protoLoader.loadSync(
  "../grpc-server/proto/privy.proto",
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const privyProto = grpc.loadPackageDefinition(packageDefinition).privy;

// Create a client instance
const client = new privyProto.PrivyService(
  "127.0.0.1:3000",
  grpc.credentials.createInsecure()
);

// Promisify the methods
const CreateUser = promisify(client.CreateUser).bind(client);
const UpdateUser = promisify(client.UpdateUser).bind(client);
const DeleteUser = promisify(client.DeleteUser).bind(client);
const GetUser = promisify(client.GetUser).bind(client);
const InsertMessage = promisify(client.InsertMessage).bind(client);
// const FingerprintTest = promisify(client.FingerprintTest).bind(client);

// Test all the methods
(async () => {
  try {
    // Test CreateUser
    const userAddr = "rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr";
    const oldUsername = "arrayappy";
    const newUsername = "naidu";

    const createUserResponse = await CreateUser({
      user_addr: userAddr,
      user_name: oldUsername,
    });
    console.log("CreateUser Response:", createUserResponse);

    // Test GetUserByAddr
    const getUserByAddrResponse = await GetUserByAddr({
      user_addr: userAddr,
    });
    console.log("GetUserByAddr Response:", getUserByAddrResponse);

    // Test UpdateUser
    const updateUserResponse = await UpdateUser({
      user_addr: userAddr,
      user_name: newUsername,
    });
    console.log("UpdateUser Response:", updateUserResponse);

    // Test GetUserByName
    const getUserByNameResponse = await GetUserByName({
      user_name: newUsername,
    });
    console.log("GetUserByName Response:", getUserByNameResponse);

    // Test DeleteUser
    const deleteUserResponse = await DeleteUser({
      user_addr: userAddr,
    });
    console.log("DeleteUser Response:", deleteUserResponse);

    const insertMessageResponse = await InsertMessage({
      user_addr: userAddr,
      message: "hey1",
      fingerprint_id: "finger01",
      cat_idx: 0,
      passkey: "",
    });
    console.log(insertMessageResponse);

    const getUserResponse = await GetUser({
      user_name: newUsername,
      cat_idx: 0,
      fingerprint_id: "finger01",
    });
    console.log(getUserResponse);

    // const fingerprintTestResponse = await FingerprintTest({});
    // console.log(fingerprintTestResponse)
  } catch (err) {
    console.error("Error:", err);
  }
})();
