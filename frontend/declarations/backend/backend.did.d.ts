import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Address {
  'balance' : number,
  'publicKey' : string,
  'createdAt' : bigint,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface Transaction {
  'to' : string,
  'fee' : number,
  'status' : string,
  'from' : string,
  'amount' : number,
}
export interface _SERVICE {
  'generateAddress' : ActorMethod<[], Result>,
  'getAddresses' : ActorMethod<[], Array<[string, Address]>>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
  'sendBitcoin' : ActorMethod<[string, string, number], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
