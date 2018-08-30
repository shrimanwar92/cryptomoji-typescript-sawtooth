const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
const cbor = require('cbor');
const {createHash} = require('crypto');
import {
  Transaction,
  TransactionHeader,
  Batch,
  BatchHeader,
  BatchList
} from 'sawtooth-sdk/protobuf';
import axios from 'axios';



const FAMILY_NAME: string = 'cryptomoji';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '5f4d76';

const context = createContext('secp256k1');
const privateKey = context.newRandomPrivateKey();
const signer = CryptoFactory(context).newSigner(privateKey);
const privateKeyHex = privateKey.asHex();
const publicKeyHex = signer.getPublicKey().asHex();

const payload = {
    action: 'CREATE_COLLECTION'
}
const payloadBytes = cbor.encode(payload);

const transactionHeaderBytes = TransactionHeader.encode({
    signerPublicKey: publicKeyHex,
    batcherPublicKey: publicKeyHex,
    familyName: FAMILY_NAME,
    familyVersion: FAMILY_VERSION,
    inputs: [ NAMESPACE ],
    outputs: [ NAMESPACE ],
    nonce: (Math.random() * 10 ** 18).toString(36),
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish()

const signature = signer.sign(transactionHeaderBytes)

const transaction = Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
});

const transactions = [transaction]

const batchHeaderBytes = BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

const signature2 = signer.sign(batchHeaderBytes)

const batch = Batch.create({
    header: batchHeaderBytes,
    headerSignature: signature2,
    transactions: transactions
});

const batchListBytes = BatchList.encode({
    batches: [batch]
}).finish()

axios({
  url: 'http://localhost:8008/batches',
  method: 'get',
  data: batchListBytes,
  headers: { 'Content-Type': 'application/octet-stream' }
}).then(data => {
   console.log(data.data); 
});


/*// Config variables
const KEY_NAME = 'transfer-chain.keys'
const API_URL = 'http://localhost:8008'

const FAMILY_NAME: string = 'cryptomoji';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '5f4d76';*/
