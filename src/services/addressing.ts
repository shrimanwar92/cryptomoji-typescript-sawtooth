import { createHash } from 'crypto';

const NAMESPACE: string = '5f4d76';
const PREFIXES: any = {
	COLLECTION: '00',
	MOJI: '01',
	SIRE_LISTING: '02',
	OFFER: '03'
};

class AddressStore {

	hash(str: string, length: number): string {
		return createHash('sha512').update(str).digest('hex').slice(0, length);
	}

	getCollectionAddress(publicKey: string): string {
		return NAMESPACE + PREFIXES.COLLECTION + this.hash(publicKey, 62);
	}

	getMojiAddress(ownerKey: string, dna: string): string {
		return NAMESPACE + PREFIXES.MOJI + this.hash(ownerKey, 8) + this.hash(dna, 54);
	}

	getSireAddress(ownerKey: string): string {
		return NAMESPACE + PREFIXES.SIRE_LISTING + this.hash(ownerKey, 62);
	}

	isValidAddress(address: string): boolean {
		const pattern = `^${NAMESPACE}[0-9a-f]{64}$`;
		return new RegExp(pattern).test(address);
	}
}

export default new AddressStore();