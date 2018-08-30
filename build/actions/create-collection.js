"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("sawtooth-sdk/processor/exceptions");
const addressing_1 = require("../services/addressing");
const prng_1 = require("../services/prng");
const encoding_1 = require("../services/encoding");
const NEW_MOJI_COUNT = 3;
const DNA_LENGTH = 9;
const GENE_SIZE = Math.pow(2, (2 * 8));
const makeDna = (prng) => {
    return [...Array(DNA_LENGTH)].map(() => {
        const randomHex = prng(GENE_SIZE).toString(16);
        return ('0000' + randomHex).slice(-4);
    }).join('');
};
const makeMoji = (publicKey, prng) => {
    return [...Array(NEW_MOJI_COUNT)].map(() => ({
        dna: makeDna(prng),
        owner: publicKey,
        sire: null,
        breeder: null,
        sired: [],
        bred: []
    }));
};
function createCollection(context, publicKey, signature) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = addressing_1.default.getCollectionAddress(publicKey);
        const prng = prng_1.default(signature);
        try {
            const state = yield context.getState([address]);
            const updates = {};
            const mojiAddresses = [];
            if (state[address].length > 0) {
                throw new exceptions_1.InvalidTransaction(`Collection already exists with key: ${publicKey}`);
            }
            const mojis = makeMoji(publicKey, prng);
            mojis.forEach(moji => {
                const mojiAddress = addressing_1.default.getMojiAddress(publicKey, moji.dna);
                updates[mojiAddress] = encoding_1.encode(moji);
                mojiAddresses.push(mojiAddress);
            });
            updates[address] = encoding_1.encode({
                key: publicKey,
                moji: mojiAddresses
            });
            return context.setState(updates);
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.default = createCollection;
