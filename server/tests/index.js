import axios from 'axios';

const API_URL = 'http://127.0.0.1:8081';

// Test all the methods
(async () => {
  try {
    // Test data
    const userAddr = "rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr";
    const oldUsername = "arrayappy";
    const newUsername = "naidu";
    const password_salt = "key1";
    const password_pubkey = "password_pubkey";


    // Test Status
    console.log("\nTesting Status...");
    try {
      const statusResponse = await axios.get(`${API_URL}/status`);
      console.log("Status Response:", statusResponse.data);
    } catch (error) {
      console.error("Status Error:", error.response?.data || error.message);
    }

    // // Test CreateUser
    console.log("\nTesting CreateUser...");
    try {
      const createUserResponse = await axios.post(`${API_URL}/create_user`, {
        user_addr: userAddr,
        user_name: oldUsername,
        password_salt: password_salt,
        password_pubkey: password_pubkey
      });
      console.log("CreateUser Response:", createUserResponse.data);
    } catch (error) {
      console.error("CreateUser Error:", error.response?.data || error.message);
    }

    // Test GetUser
    console.log("\nTesting GetUser...");
    try {
      const getUserResponse = await axios.post(`${API_URL}/get_user`, {
        user_name: oldUsername,
        cat_idx: 0,
        fingerprint_id: "finger01"
      });
      console.log("GetUser Response:", getUserResponse.data);
    } catch (error) {
      console.error("GetUser Error:", error.response?.data || error.message);
    }

    // // Test UpdateUser
    // console.log("\nTesting UpdateUser...");
    // try {
    //   const updateUserResponse = await axios.post(`${API_URL}/update_user`, {
    //     user_addr: userAddr,
    //     user_name: newUsername,
    //     password_salt: password_salt,
    //     password_pubkey: password_pubkey
    //   });
    //   console.log("UpdateUser Response:", updateUserResponse.data);
    // } catch (error) {
    //   console.error("UpdateUser Error:", error.response?.data || error.message);
    // }

    // // Test InsertMessage
    // console.log("\nTesting InsertMessage...");
    // try {
    //   const insertMessageResponse = await axios.post(`${API_URL}/insert_message`, {
    //     user_addr: userAddr,
    //     cat_idx: 0,
    //     encrypted_msg: JSON.stringify({
    //       content: "Test message",
    //       timestamp: Date.now(),
    //       signature: "test_signature"
    //     }),
    //     passkey: "",  // Empty if no passkey required
    //     fingerprint_id: "finger01"
    //   });
    //   console.log("InsertMessage Response:", insertMessageResponse.data);
    // } catch (error) {
    //   console.error("InsertMessage Error:", error.response?.data || error.message);
    // }

    // // Test CheckUsernameExist
    // console.log("\nTesting CheckUsernameExist...");
    // try {
    //   const checkUsernameExist = await axios.post(`${API_URL}/check_username_exist`, {
    //     user_name: newUsername
    //   });
    //   console.log("CheckUsernameExist Response:", checkUsernameExist.data);
    // } catch (error) {
    //   console.error("CheckUsernameExist Error:", error.response?.data || error.message);
    // }

    // // Test DeleteUser (run this last)
    console.log("\nTesting DeleteUser...");
    try {
      const deleteUserResponse = await axios.post(`${API_URL}/delete_user`, {
        user_addr: userAddr
      });
      console.log("DeleteUser Response:", deleteUserResponse.data);
    } catch (error) {
      console.error("DeleteUser Error:", error.response?.data || error.message);
    }

  } catch (err) {
    if (err.response) {
      console.error("Error Response Data:", err.response.data);
      console.error("Error Response Status:", err.response.status);
    } else if (err.request) {
      console.error("Error Request:", err.request);
    } else {
      console.error("Error Message:", err.message);
    }
  }
})();
