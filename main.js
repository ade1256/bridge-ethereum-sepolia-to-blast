const { ethers } = require("ethers");
const readline = require("readline");

const promptUser = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
};

const main = async () => {
    const PRIVATE_KEY = await promptUser("Enter your private key: ");
    const valueInput = await promptUser("Enter the amount of ETH to send (in Ether): ");
    const value = ethers.parseEther(valueInput);
    const BlastBridgeAddress = "0xdeda8d3ccf044fe2a16217846b6e1f1cfd8e122f";
    const sepoliaProvider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/6ri4OS5vDZHlf-tfkkNm56uXjo2jyi7m`);
    const blastProvider = new ethers.JsonRpcProvider("https://sepolia.blast.io");
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const sepoliaWallet = wallet.connect(sepoliaProvider);
    const tx = {
        to: BlastBridgeAddress,
        value: value
    };
    try {
        const transaction = await sepoliaWallet.sendTransaction(tx);
        console.log("Processing transaction...")
        await transaction.wait();
        const balance = await blastProvider.getBalance(wallet.address);
        console.log(`TxHash: `, transaction.hash);
        console.log(`Balance on Blast: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("Error sending transaction: ", error);
    }
}

main();
