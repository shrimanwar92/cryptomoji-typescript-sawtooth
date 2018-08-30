"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processor_1 = require("sawtooth-sdk/processor");
const handler_1 = require("./handler");
// Set validator URL, note that default not valid in docker-compose environment
const VALIDATOR_URL = process.env.VALIDATOR_URL || 'tcp://localhost:4004';
const tp = new processor_1.TransactionProcessor(VALIDATOR_URL);
const handler = new handler_1.default();
tp.addHandler(handler);
tp.start();
