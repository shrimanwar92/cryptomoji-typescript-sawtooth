"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const NAMESPACE = '5f4d76';
const PREFIXES = {
    COLLECTION: '00',
    MOJI: '01',
    SIRE_LISTING: '02',
    OFFER: '03'
};
class AddressStore {
    hash(str, length) {
        return crypto_1.createHash('sha512').update(str).digest('hex').slice(0, length);
    }
    getCollectionAddress(publicKey) {
        return NAMESPACE + PREFIXES.COLLECTION + this.hash(publicKey, 62);
    }
    getMojiAddress(ownerKey, dna) {
        return NAMESPACE + PREFIXES.MOJI + this.hash(ownerKey, 8) + this.hash(dna, 54);
    }
    getSireAddress(ownerKey) {
        return NAMESPACE + PREFIXES.SIRE_LISTING + this.hash(ownerKey, 62);
    }
    isValidAddress(address) {
        const pattern = `^${NAMESPACE}[0-9a-f]{64}$`;
        return new RegExp(pattern).test(address);
    }
}
exports.default = new AddressStore();
