const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

/**
 * Hash message using KECCAK-256
 * @param message
 * @returns the hash of the message
 */
const hashMessage = (message) => {
  return keccak256(Uint8Array.from(message));
};

/**
 * Convert a public key to an address
 * @param publicKey the public key.
 * @returns the address in hex format.
 */
const publicKeyToAddress = (publicKey) => {
  const hash = keccak256(publicKey.slice(1));
  return toHex(hash.slice(-20)).toUpperCase();
};
