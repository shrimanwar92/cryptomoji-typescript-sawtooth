"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("sawtooth-sdk/processor/handler");
const exceptions_1 = require("sawtooth-sdk/processor/exceptions");
const create_collection_1 = require("./actions/create-collection");
const encoding_1 = require("./services/encoding");
const FAMILY_NAME = 'cryptomoji';
const FAMILY_VERSION = '0.1';
const NAMESPACE = '5f4d76';
class MojiHandler extends handler_1.TransactionHandler {
    constructor() {
        console.log('Initializing cryptomoji handler with namespace:', NAMESPACE);
        super(FAMILY_NAME, [FAMILY_VERSION], [NAMESPACE]);
    }
    apply(txn, context) {
        let payload = null;
        try {
            payload = encoding_1.decode(txn.payload);
        }
        catch (err) {
            throw new exceptions_1.InvalidTransaction('Failed to decode payload: ' + err);
        }
        const action = payload.action;
        const publicKey = txn.header.signerPublicKey;
        if (action === 'CREATE_COLLECTION') {
            return create_collection_1.default(context, publicKey, txn.signature);
        }
        else {
            throw new exceptions_1.InvalidTransaction('Unknown action: ' + action);
        }
    }
}
exports.default = MojiHandler;
