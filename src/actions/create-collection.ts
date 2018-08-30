import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions';
import AddressStore from '../services/addressing';
import getPrng from '../services/prng';
import { encode, decode } from '../services/encoding';

const NEW_MOJI_COUNT: number = 3;
const DNA_LENGTH: number = 9;
const GENE_SIZE: number = 2 ** (2 * 8);

interface Moji {
	dna: string,
    owner: string,
    sire: string,
    breeder: string,
    sired: Array<string>,
    bred: Array<string>
}

const makeDna = (prng: any): string => {
	return [...Array(DNA_LENGTH)].map(() => {
    	const randomHex = prng(GENE_SIZE).toString(16);
    	return ('0000' + randomHex).slice(-4);
  	}).join('');
};

const makeMoji = (publicKey: string, prng: any): Array<Moji> => {
	return [...Array(NEW_MOJI_COUNT)].map(() => ({
	    dna: makeDna(prng),
	    owner: publicKey,
	    sire: null,
	    breeder: null,
	    sired: [],
	    bred: []
	}));
};

async function createCollection(context: any, publicKey: string, signature: string): Promise<any> {
	  const address: string = AddressStore.getCollectionAddress(publicKey);
  	const prng: any = getPrng(signature);

  	try {
  		const state = await context.getState([address]);
  		const updates = {};
      	const mojiAddresses = [];

  		if (state[address].length > 0) {
        	throw new InvalidTransaction(`Collection already exists with key: ${publicKey}`);
      	}

      	const mojis: Array<Moji> = makeMoji(publicKey, prng);
      	mojis.forEach(moji => {
      		const mojiAddress = AddressStore.getMojiAddress(publicKey, moji.dna);
      		updates[mojiAddress] = encode(moji);
      		mojiAddresses.push(mojiAddress);
      	});

      	updates[address] = encode({
      		key: publicKey,
      		moji: mojiAddresses
      	});

      	return context.setState(updates);

  	} catch (err) {
  		throw new Error(err);
  	}
}

export default createCollection;