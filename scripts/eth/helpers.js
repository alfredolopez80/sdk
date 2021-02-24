export async function getTokenBalance(web3, contractAddress, abi, address) {
	const contract = new web3.eth.Contract(abi, contractAddress);
	return contract.methods.balanceOf(address).call();
}

export async function sendTokens(web3, contractAddress, abi, signer, to, amount) {
	const contract = new web3.eth.Contract(abi, contractAddress);
	const encoded = contract.methods.transfer(to, amount).encodeABI();

	const transferTransaction = await signer.signTransaction(
		{
			to: contractAddress,
			data: encoded,
			value: "0x00",
			gasPrice: "0x01",
			gas: "0x1000000",
		});
	
		const transferReceipt = await web3.eth.sendSignedTransaction(
			transferTransaction.rawTransaction
		);
		console.log(
		`Transfer executed to ${transferReceipt.to} (H: ${transferReceipt.transactionHash})`
	);
	return transferReceipt;
}