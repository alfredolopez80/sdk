import {Keyring} from '@polkadot/api';
import {randomAsHex, encodeAddress} from '@polkadot/util-crypto';

import dock, {DockAPI, PublicKeySr25519} from '../../src/api';

import {FullNodeEndpoint, TestKeyringOpts, TestAccount} from '../test-constants';
import {getPublicKeyFromKeyringPair, getSignatureFromKeyringPair} from '../../src/utils/misc';
import {PublicKeyEd25519} from '../../src/public-key';
import {SignatureEd25519, SignatureSr25519} from '../../src/signature';

import  {
  RevokeRegistry,
  RevokePolicy,
} from '../../src/utils/revocation';
import {createKeyDetail} from '../../src/utils/did';

describe('Revocation Module', () => {
  const dock = new DockAPI(FullNodeEndpoint);

  // Create a random registry id
  const registryID = randomAsHex(32);

  // Create a new controller DID, the DID will be registered on the network and own the registry
  const controllerDID = randomAsHex(32);
  const controllerSeed = randomAsHex(32);

  // TODO: Uncomment the `beforeAll` and unskip the tests once a node is deployed.
  beforeAll(async (done) => {
    await dock.init();
    done();
  });

  test('Can connect to node', () => {
    //await dock.init();
    expect(!!dock.api).toBe(true);
  });

  test('Has keyring and account', () => {
    dock.keyring = new Keyring(TestKeyringOpts);
    const account = dock.keyring.addFromUri(TestAccount.uri, TestAccount.options);
    dock.setAccount(account);
    expect(!!dock.keyring).toBe(true);
    expect(!!dock.account).toBe(true);
  });

  test('Create a DID', async () => {
    // The DID should be written before any test begins
    const pair = dock.keyring.addFromUri(controllerSeed, null, 'sr25519');
    const publicKey = PublicKeySr25519.fromKeyringPair(pair);

    // The controller is same as the DID
    const keyDetail = createKeyDetail(publicKey, controllerDID);

    const transaction = dock.did.new(controllerDID, keyDetail);
    const result = await dock.sendTransaction(transaction);
    expect(!!result).toBe(true);
  }, 3000);

  test('Can create a registry', async () => {
    const controllers = new Set();
    controllers.add(controllerDID);

    // we used to init treeset before but doesnt seem needed
    // const controllersTreeSet = new BTreeSet(dock.api.registry, String, controllers);
    // const policy = new RevokePolicy(controllersTreeSet);
    const policy = new RevokePolicy(controllers);
    const registry = new RevokeRegistry(policy, false);

    const transaction = dock.revocation.newRegistry(registryID, registry);
    const result = await dock.sendTransaction(transaction);
    expect(!!result).toBe(true);
    const reg = await dock.revocation.getRevocationRegistry(registryID);
    expect(!!reg).toBe(true);
  }, 30000);

  test('Can remove a registry', async () => {
    const registryDetail = await dock.revocation.getRegistryDetail(registryID);
    expect(!!registryDetail).toBe(true);

    const lastModified = registryDetail[1];
    const remReg = {
      registry_id: registryID,
      last_modified: lastModified
    };
    const serializedRemReg = dock.revocation.getSerializedRemoveRegistry(remReg);
    const pair = dock.keyring.addFromUri(controllerSeed, null, 'sr25519');
    const sig = getSignatureFromKeyringPair(pair, serializedRemReg);

    const pAuth = new Map();
    pAuth.set(controllerDID, sig.toJSON());

    const transaction = dock.revocation.removeRegistry(remReg, pAuth);
    const result = await dock.sendTransaction(transaction);
    expect(!!result).toBe(true);
    await expect(dock.revocation.getRegistryDetail(registryID)).rejects.toThrow(/Could not find revocation registry/);
  }, 30000);

  test.skip('Can create a registry with multiple controllers', async () => {
    const registryID = randomAsHex(32); // TODO: ensure random values arent same as in other tests?
    const controllers = new Set();

    // TODO: ensure random values arent same as in other tests?
    controllers.add(randomAsHex(32));
    controllers.add(randomAsHex(32));

    const policy = new RevokePolicy(controllers);
    const registry = new RevokeRegistry(policy, false);

    const transaction = dock.revocation.newRegistry(registryID, registry);
    const result = await dock.sendTransaction(transaction);
    expect(!!result).toBe(true);
    const reg = await dock.revocation.getRevocationRegistry(registryID);
    expect(!!reg).toBe(true);
  }, 30000);
});
