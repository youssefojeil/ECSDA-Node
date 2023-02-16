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

/**
 * Get the public key from the signature
 * @param signature the signature in hex format with recovery bit as the first byte
 * @returns the public key
 */
const signatureToPublicKey = (message, signature) => {
  const hash = hashMessage(message);
  const fullSignatureBytes = hexToBytes(signature);
  const recoveryBit = fullSignatureBytes[0];
  const signatureBytes = fullSignatureBytes.slice(1);

  return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
};

module.exports = {
  hashMessage,
  publicKeyToAddress,
  signatureToPublicKey,
};
