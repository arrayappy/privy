import getApiUrl from "src/utils/api/getApiUrl";

async function createUser(user_addr: string, user_name: string, password_salt: string, password_pubkey: string) {
  const res = await fetch(`${getApiUrl()}/create_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_addr, user_name, password_salt, password_pubkey }),
  });
  return res.json();
}


async function updateUser(user_addr: string, user_name: string, password_salt: string, password_pubkey: string) {
  const res = await fetch(`${getApiUrl()}/update_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_addr, user_name, password_salt, password_pubkey }),
  });
  return res.json();
}

async function getUser(user_name: string) {
  const res = await fetch(`${getApiUrl()}/get_user?user_name=${user_name}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

async function getDbUser(user_addr: string) {
  const res = await fetch(`${getApiUrl()}/get_db_user?user_addr=${user_addr}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export { createUser, updateUser, getUser, getDbUser };