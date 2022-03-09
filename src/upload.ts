import * as IPFS from 'ipfs-core';
import fs from 'fs';
import Web3 from 'web3';
import { CustomContract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import { IMethod, IEvent } from './types/contract';
import Abi from './abi.json';

const web3 = new Web3();
web3.setProvider("https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c");
const contract = new web3.eth.Contract(Abi as AbiItem[], '0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3') as CustomContract<IMethod, IEvent>;

const uploadToIPFS = (filePath: string) => {
  fs.readFile(filePath, async (err, data) => {
    if (err) {
      console.error("Failed to read file: ", err);
      return process.exit();
    }

    try {
      const ipfs = await IPFS.create();
      const { cid } = await ipfs.add({ path: filePath, content: data });

      const account = web3.eth.accounts.privateKeyToAccount("YOUR PRIVATE KEY");

      account.signTransaction({
        chainId: 5,
        to: '0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3',
        value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gas: 100000,
        data: contract.methods.store(cid.toString()).encodeABI(),
      }).then((transaction) => {
        if (transaction.rawTransaction) {
          web3.eth.sendSignedTransaction(transaction.rawTransaction, (err, tx) => {
            if (err) {
              console.error("Failed to store CID: ", err);
              return process.exit();
            }

            console.log("CID has been stored successfully.");
            return process.exit();
          });
        }
      });
    } catch (err) {
      console.error("Failed to upload file to IPFS: ", err);
      return process.exit();
    }
  });
};


const filePath = process.argv[2];
filePath && uploadToIPFS(filePath);
