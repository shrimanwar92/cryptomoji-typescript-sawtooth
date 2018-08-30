import { TransactionHandler } from 'sawtooth-sdk/processor/handler';
import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions';
import createCollection from './actions/create-collection';
import { encode, decode } from './services/encoding';

const FAMILY_NAME: string = 'cryptomoji';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '5f4d76';

export default class MojiHandler extends TransactionHandler {
  
  constructor () {
    console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
    super(FAMILY_NAME, [ FAMILY_VERSION ], [ NAMESPACE ]);
  }

  apply (txn, context) {
    let payload = null;
    try {
      payload = decode(txn.payload);
    } catch (err) {
      throw new InvalidTransaction('Failed to decode payload: ' + err);
    }

    const action = payload.action;
    const publicKey = txn.header.signerPublicKey;

    if (action === 'CREATE_COLLECTION') {
      return createCollection(context, publicKey, txn.signature);
    } else {
      throw new InvalidTransaction('Unknown action: ' + action);
    }
  }
}