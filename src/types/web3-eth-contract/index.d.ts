import { Contract } from "web3-eth-contract";

declare module "web3-eth-contract" {
  export interface CustomContract<T, K> extends Contract {
    methods: T
    events: K
  }
}
