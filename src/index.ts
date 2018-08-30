import { TransactionProcessor } from 'sawtooth-sdk/processor';
import { InvalidTransaction } from 'sawtooth-sdk/processor/exceptions';
import MojiHandler from './handler';

// Set validator URL, note that default not valid in docker-compose environment
const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';

const tp = new TransactionProcessor(VALIDATOR_URL);
const handler: MojiHandler = new MojiHandler();

tp.addHandler(handler);
tp.start()