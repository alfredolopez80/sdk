import { getPublicKeyFromKeyringPair } from '../misc';

/**
 * Helper to get the key doc in a format needed for vc.js.
 * @param {string} did - DID in fully qualified form
 * @param {object} keypair - Keypair is generated by either using polkadot-js's keyring for Sr25519 and
 * Ed25519 or keypair generated with `generateEcdsaSecp256k1Keypair` for curve secp256k1.
 * @param {string} type - the type of key, Sr25519VerificationKey2020 or Ed25519VerificationKey2018 or EcdsaSecp256k1VerificationKey2019
 * @returns {{publicKeyBase58: *, controller: *, id: string, type: *, privateKeyBase58: (string|KeyObject|T2|Buffer|CryptoKey)}}
 */
export default function getKeyDoc(did, keypair, type) {
  return {
    id: `${did}#keys-1`,
    controller: did,
    type,
    keypair,
    publicKey: getPublicKeyFromKeyringPair(keypair),
  };
}
