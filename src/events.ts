import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import Abi from './abi.json';

const web3 = new Web3();
web3.setProvider("https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c");

const fetchEvents = (address: string) => {
  const contract = new web3.eth.Contract(Abi as AbiItem[], address);

  contract.getPastEvents(
    "CIDStored",
    { fromBlock: "earliest" }
  ).then(function(events) {
    console.log(events);
  });
};


const address = process.argv[2];
address && fetchEvents(address );
