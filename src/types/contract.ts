import { ContractSendMethod } from 'web3-eth-contract';

export interface IMethod {
  store: (cid: string) => ContractSendMethod
}

export interface IEvent {
  CIDStored: Function
}
