const { getAddressFromMnemonic } = require('@stacks/common');
const mnemonic = 'usage upon hawk topic waste mobile stairs daughter hobby weekend answer illness';
async function run() {
  try {
    const address = await getAddressFromMnemonic(mnemonic);
    console.log(address);
  } catch (e) {
    // console.log(e);
    // Alternate way using stacks-network/wallet-sdk if common is not available
    const { generateWallet } = require('@stacks/wallet-sdk');
    const wallet = await generateWallet({ mnemonic, password: '' });
    console.log(wallet.accounts[0].address);
  }
}
run();
