import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Address { 'publicKey' : string, 'createdAt' : bigint }
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'generateAddress' : ActorMethod<[], Result>,
  'getAddresses' : ActorMethod<[], Array<[string, Address]>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
