import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';

const packageDefinition = protoLoader.loadSync('../grpc-server/proto/privy.proto');
const { privy } = grpc.loadPackageDefinition(packageDefinition);

const client = new privy.PrivyService('127.0.0.1:3000', grpc.credentials.createInsecure());

// Make the request using a promise
const GetUserByAddr = promisify(client.GetUserByAddr).bind(client);
const GetUserByName = promisify(client.GetUserByAddr).bind(client);


(async () => {
  try {
    const response = await GetUserByAddr({user_addr: "0x1"});
    const response1 = await GetUserByAddr({user_name: "0x1"}); 
    console.log('Response:', response, response1);
  } catch (err) {
    console.error('Error:', err);
  }
})();
