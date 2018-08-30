"use strict";
exports.__esModule = true;
var _a = require('sawtooth-sdk/signing'), createContext = _a.createContext, CryptoFactory = _a.CryptoFactory;
var encoding_1 = require("./services/encoding");
var createHash = require('crypto').createHash;
var axios_1 = require("axios");
/*const FAMILY_NAME: string = 'cryptomoji';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '5f4d76';

const context = createContext('secp256k1');
const privateKey = context.newRandomPrivateKey();
const signer = new CryptoFactory(context).newSigner(privateKey);
const privateKeyHex = privateKey.asHex();
const publicKeyHex = signer.getPublicKey().asHex();

const payload = {
    action: 'CREATE_COLLECTION'
}
const payloadBytes = encode(payload);

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
  method: 'POST',
  data: batchListBytes,
  headers: { 'Content-Type': 'application/octet-stream' }
}).then(data => {
   console.log(data);
}); */
function getData() {
    axios_1["default"].get("http://localhost:8008/state?address=5f4d76").then(function (response) {
        var resp = response.data;
        var resources = resp.data.map(function (_a) {
            var address = _a.address, data = _a.data;
            return Object.assign({ address: address, data: data }, encoding_1.decode(data));
        });
        console.log(resources);
    });
}
getData();
/*const addressToType = (address = '') => {
  const type = Object.keys(FULL_PREFIXES)
    .find(type => FULL_PREFIXES[type] === address.slice(0, 8));

  return type || null;
};*/
/*// Config variables
const KEY_NAME = 'transfer-chain.keys'
const API_URL = 'http://localhost:8008'

const FAMILY_NAME: string = 'cryptomoji';
const FAMILY_VERSION: string = '0.1';
const NAMESPACE: string = '5f4d76';*/
