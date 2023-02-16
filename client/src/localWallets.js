import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

/**
 * Simulate MetaMask like wallet which stores private keys
 * and gives access to public keys/address
 * keys are stored in hexadecimal format
 */

// List of account keys in hexa format without the '0x'
const ACCOUNT_KEYS = new Map([
  [
    "bob",
    {
      privateKey:
        "375969494c991fef613343fdb163665cea928b3f8185db9ef8b77e162e96bf12",
      publicKey:
        "044b295d147068d4cbae1277098c2d66dde85d92bea4fa7368025be78067bb7a6bc80408c466f74c55b40b132d0b44d8615ae6d3505062e165ce6f82552257665a",
    },
  ],
  [
    "alice",
    {
      privateKey:
        "7646a936705c7b51fa28ca0251cbbbebe5d9030282434c531a76fe2b4f2bf52e",
      publicKey:
        "04bbb34ec1e7ba7bbb6b64f1efb7f55224ea8aa44976b27ef97a348c11902eeb18cd0cbc612c40e2a19375e28edce1dde7a73ecfdf8620f51aadf544e5652e33a0",
    },
  ],
  [
    "charles",
    {
      privateKey:
        "cebf6cd6f033901a212e95cd6f4a23a2a7a8299b0d2429f8e838b5b2d1ee336c",
      publicKey:
        "041a29c5e0e72ab1461d4b15d6385b3ce464c7ec737cce113f378ae767af903a309982b6da43786470adddb4d5946f4f3fbcab9575e4e830984920b4f2faa1d20d",
    },
  ],
]);

// usernames derived from the list of accounts
const USERS = Array.from(ACCOUNT_KEYS.keys());

/**
 * Hash a message using KECCAK-256
 * @param message the message that will be hashed
 * @returns the hash of the message
 */

const hashMessage = (message) => {
  return keccak256(Uint8Array.from(message));
};

/**
 * Get user's private key
 * @param user
 * @returns the user's private key as a Uint8Array
 */

const getPrivateKey = (user) => {
  if (!user) return null;
  return hexToBytes(ACCOUNT_KEYS.get(user).privateKey);
};

/**
 * Get user's public key
 * @param user
 * @returns the user's public key
 */

// const getPublicKey = (user) => {
//   if (!user) return null;
//   return hexToBytes(secp.getPublicKey(ACCOUNT_KEYS.get(user).privateKey));
// };

//or
const getPublicKey = (user) => {
  if (!user) return null;
  return hexToBytes(ACCOUNT_KEYS.get(user).publicKey);
};

/**
 * Get Address from public key of user
 * @param user
 * @returns The user's address as a hex string
 */

const getAddress = (user) => {
  if (!user) return null;
  console.log(user);
  const publicKey = getPublicKey(user);
  console.log(publicKey);
  const hash = keccak256(publicKey.slice(1));
  console.log(hash);
  // address is last 20 bytes of hashed publickey
  const address = toHex(hash.slice(-20)).toUpperCase();
  console.log(address);
  return address;
};

/**
 * Get user's public key in Hex format
 * @param user
 * @returns the public key in hex format
 */

const getHexPublicKey = (user) => {
  if (!user) return null;
  return toHex(getPublicKey(user).toUpperCase());
};

/**
 * Sign message
 * @param username name of the user's account
 * @param message the message to sign
 * @returns the signature in hex format with the recovery bit as the first byte
 */

const sign = async (username, message) => {
  const privateKey = getPrivateKey(username);
  const hash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
    recovered: true,
  });

  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
};

const wallet = {
  USERS,
  sign,
  getAddress,
  getHexPublicKey,
};

export default wallet;
