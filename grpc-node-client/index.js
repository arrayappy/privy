import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';

// Load the proto file
const packageDefinition = protoLoader.loadSync('../grpc-server/proto/privy.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const privyProto = grpc.loadPackageDefinition(packageDefinition).privy;

// Create a client instance
const client = new privyProto.PrivyService('127.0.0.1:3000', grpc.credentials.createInsecure());

// Promisify the methods
const GetUserByAddr = promisify(client.GetUserByAddr).bind(client);
const GetUserByName = promisify(client.GetUserByName).bind(client);
const CreateUser = promisify(client.CreateUser).bind(client);
const UpdateUser = promisify(client.UpdateUser).bind(client);
const DeleteUser = promisify(client.DeleteUser).bind(client);
const InsertMessage = promisify(client.InsertMessage).bind(client);

// Test all the methods
(async () => {
  try {
    // Test CreateUser
    const createUserResponse = await CreateUser({
      user_addr: "0x3",
      user_name: "Alice1"
    });
    console.log('CreateUser Response:', createUserResponse);

    // Test GetUserByAddr
    const getUserByAddrResponse = await GetUserByAddr({ user_addr: "0x3" });
    console.log('GetUserByAddr Response:', getUserByAddrResponse);

    // Test UpdateUser
    const updateUserResponse = await UpdateUser({
      user_addr: "0x3",
      user_name: "Alice3"
    });
    console.log('UpdateUser Response:', updateUserResponse);

    // Test GetUserByName
    const getUserByNameResponse = await GetUserByName({ user_name: "Alice3" });
    console.log('GetUserByName Response:', getUserByNameResponse);    

    // Test DeleteUser
    const deleteUserResponse = await DeleteUser({ user_addr: "0x3" });
    console.log('DeleteUser Response:', deleteUserResponse);
    
    const insertMessageResponse = await InsertMessage({ user_addr: "hi", message:"hey" })
    console.log(insertMessageResponse)
  } catch (err) {
    console.error('Error:', err);
  }
})();
