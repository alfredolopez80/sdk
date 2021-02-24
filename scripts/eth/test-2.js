import { ethers, ContractFactory } from 'ethers';
// import {parse} from '@ethersproject/transactions';
import {ERC20_BYTECODE, ERC20_ABI, LinkTokenABI, LinkTokenByteCode, OracleByteCode, OracleABI, AggregatorByteCode, AggregatorABI, AccessControlledAggregatorABI, AccessControlledAggregatorByteCode} from './bytecodes';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:9933');

async function main() {
  const alice = new ethers.Wallet('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709', provider);
	const bob = new ethers.Wallet('0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098', provider);

  const txnPayload = {
    data: ERC20_BYTECODE,
    value: "0x00",
    gasPrice: "0x01",
    gasLimit: "0x200000000",
  };

  // const createTransaction = await alice.signTransaction(txnPayload);
  // console.log(createTransaction);

	/* console.log("Transaction", {
		...createTransaction,
		rawTransaction: `${createTransaction.rawTransaction.substring(
			0,
			32
		)}... (${createTransaction.rawTransaction.length} length)`,
	}); */

  // const signedTx = parse(createTransaction);
  // console.log(signedTx);
  // const createReceipt = await provider.sendTransaction(createTransaction);
  // console.log(
	// 	`Contract deployed at address ${createReceipt.hash}`
	// );

  // const createReceipt = await alice.sendTransaction(txnPayload);
	// console.log(createReceipt);

  /* const factory = new ContractFactory(ERC20_ABI, ERC20_BYTECODE, alice);

  // console.log(contract.deployTransaction);

  // If your contract requires constructor args, you can specify them here
  const contract = await factory.deploy({
    value: "0x00",
    gasPrice: "0x01",
    gasLimit: "0x200000000",
  });

  console.log(contract.address); */
  
  const contract = new ethers.Contract('0xF4F1d669D0D9Ccb14eF2463fB22cB998F4D8FC12', ERC20_ABI, provider);
  // console.log(contract);
  
  console.log((await contract.totalSupply()));
  
  // Get contract address from txn hash.
  const resp = await provider.getTransaction('0xcdb83518d25864fbe2afabe235e69bdf74cec9a4cc47478e8959b2f11f573a32');
  console.log(resp.creates);
  const receipt = await provider.getTransactionReceipt('0xcdb83518d25864fbe2afabe235e69bdf74cec9a4cc47478e8959b2f11f573a32');
  console.log(receipt.contractAddress);

  // const contract = new ethers.Contract(resp.creates, ERC20_ABI, provider);
  // console.log((await contract.totalSupply()));

  // const contract = new ethers.Contract(receipt.contractAddress, ERC20_ABI, provider);
  // console.log((await contract.totalSupply()));
}

main().catch((err) => {
	console.log("Error", err);
});
