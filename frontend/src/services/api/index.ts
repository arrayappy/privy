import getApiUrl from "src/utils/api/getApiUrl";

async function createUser(user_addr: string, user_name: string, password: string) {
  // const { getPasswordSalt } = await import("@privy/sdk/utils/helpers");
  // const { generateKeypair } = await import("@privy/sdk/utils/asymmetric");
  
  // const password_salt = getPasswordSalt(password);
  // const { publicKeyPem } = generateKeypair(password_salt);
  const res = await fetch(`${getApiUrl()}/create_user`, {
    method: "POST",
    // body: JSON.stringify({ user_addr, user_name, password_salt, password_pubkey: publicKeyPem }),
  });
  return res.json();
}

export { createUser };