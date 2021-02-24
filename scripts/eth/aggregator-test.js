import Web3 from "web3";
import {AggregatorABI, OracleABI, LinkTokenABI} from './bytecodes.js';
import {getTokenBalance} from './helpers';

const { FullNodeEndpoint } = process.env;

const web3 = new Web3('http://localhost:9933');

async function sendEth(sender, receiver, amount) {
  const txn = await sender.signTransaction(
		{
			to: receiver,
			value: amount,
			gasPrice: "0x01",
			gas: "0x1000000",
		});
	
		const txnReceipt = await web3.eth.sendSignedTransaction(
			txn.rawTransaction
		);
		console.log(
		`Transfer executed (H: ${txnReceipt.transactionHash})`
	);
}

async function updateAvailableFunds(contractAddr, contract, signer) {
	let encoded = contract.methods.updateAvailableFunds().encodeABI();
	let txn = await signer.signTransaction(
		{
			to: contractAddr,
			data: encoded,
			value: "0x00",
			gasPrice: "0x01",
			gas: "0x1000000",
		}
	);
	
	let txnReceipt = await web3.eth.sendSignedTransaction(
		txn.rawTransaction
	);
	console.log(
	`Txn executed (H: ${txnReceipt.transactionHash})`
	);
}

async function addOracle(contractAddr, contract, oracleAddr, oracleAdmin, min, max, signer) {
	const encoded = contract.methods.changeOracles([], [oracleAddr], [oracleAdmin], min, max, 0).encodeABI();

	const txn = await signer.signTransaction(
		{
			to: contractAddr,
			data: encoded,
			value: "0x00",
			gasPrice: "0x01",
			gas: "0x1000000",
		});
	
		const txnReceipt = await web3.eth.sendSignedTransaction(
			txn.rawTransaction
		);
		console.log(
		`Txn executed (H: ${txnReceipt.transactionHash})`
	);
}

async function main() {
  const alice = web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
	const bob = web3.eth.accounts.privateKeyToAccount('0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098');

  // Init aggregator, aggregator owned by Alice
  const aggrAddr = '0x6677AE2e2Cc985446d42a5BDeE182702e85E8587';
	let aggrContract = new web3.eth.Contract(AggregatorABI, aggrAddr);
	const callAbi = aggrContract.methods.latestRoundData().encodeABI();
	console.log(callAbi);

		/* web3.eth.accounts.wallet.add('0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098');
	const x = await web3.eth.sendTransaction({to: aggrAddr, from: bob.address, data: callAbi, gas: "0x1000000"});
	console.log(x); */

	// const recp = await web3.eth.getTransactionReceipt('0x9471122fb8c8fcf7269cbadd6107ef7661675106ccd2665313722da14690cb8d');
  // console.log(recp);

	// process.exit(0);

	// console.log((await aggrContract.methods.allocatedFunds().call()));
	// console.log((await aggrContract.methods.availableFunds().call()));
	// console.log((await aggrContract.methods.getOracles().call()));
	// console.log((await aggrContract.methods.getRoundData(1).call()));
	console.log((await aggrContract.methods.latestRoundData().call()));
	// console.log((await getTokenBalance(web3, '0x8cB6497CDB9D44E168C076B414e4a675ebCC8683', LinkTokenABI, aggrAddr)));

  // console.log(web3.utils.toWei('.005', "ether"));
  // console.log((await web3.eth.getBalance(alice.address)));
  // console.log((await web3.eth.getBalance(bob.address)));
  // await sendEth(alice, aggrAddr, web3.utils.toWei('.005', "ether"));

  // Init oracles, oracle owned by Bob
  const oracleAddr = '0x69e5C78dAa79E5BbBe4dF6B269d77AfBC351aC90';
  let oracleContract = new web3.eth.Contract(OracleABI, oracleAddr);
	// console.log((await oracleContract.methods.getChainlinkToken().call()));

	// await updateAvailableFunds(aggrAddr, aggrContract, alice);

	// await addOracle(aggrAddr, aggrContract, oracleAddr, bob.address, 1, 1, alice);
	
	// await addOracle(aggrAddr, aggrContract, bob.address, bob.address, 1, 2, alice);

	/* const encoded = aggrContract.methods.submit(6, 40).encodeABI();

	const txn = await bob.signTransaction(
		{
			to: aggrAddr,
			data: encoded,
			value: "0x00",
			gasPrice: "0x01",
			gas: "0x1000000",
		});
	
	const txnReceipt = await web3.eth.sendSignedTransaction(txn.rawTransaction);
	console.log(`Txn executed (H: ${txnReceipt.transactionHash})`);
	console.log(txnReceipt); */

	// console.log((await aggrContract.methods.oracleRoundState(oracleAddr, 0).call()));
	// console.log((await aggrContract.methods.oracleRoundState(bob.address, 0).call()));
	// console.log(bob.address);

	const result = '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000006034d709000000000000000000000000000000000000000000000000000000006034d7090000000000000000000000000000000000000000000000000000000000000020';
	
	/* const decoded = web3.eth.abi.decodeParameters([
		{
			"roundId": "uint80",
			"answer": "int256",
			"startedAt": "uint256",
			"updatedAt": "uint256",
			"answeredInRound": "uint80"
		},
	], result); */
	
	// const decoded = web3.eth.abi.decodeParameters(["uint80", "int256", "uint256", "uint256", "uint80"], result);
	
	const decoded = web3.eth.abi.decodeParameters([
		{type: "uint80", name: "roundId"},
		{type: "int256", name: "answer"},
		{type: "uint256", name: "startedAt"},
		{type: "uint256", name: "updatedAt"},
		{type: "uint80", name: "answeredInRound"},
	], result);

	console.log(decoded);
}

main().catch((err) => {
	console.log("Error", err);
});