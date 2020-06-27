const KittyCore = artifacts.require("KittyCore");
const KittyMarketPlace = artifacts.require("KittyMarketPlace");

module.exports = async (deployer, network, accounts) => {
  const ownerAddress = accounts[0];
  const initialKittyPrice = web3.utils.toWei("0.0001", "ether")

  // Deploy contracts
  await deployer.deploy(KittyCore, {from :ownerAddress});
  await deployer.deploy(KittyMarketPlace, KittyCore.address, {from :ownerAddress});
  
  const kittyCoreInstance = await KittyCore.deployed();
  const kittyMarketPlaceInstance = await KittyMarketPlace.deployed();

  // Set first initial offer in marketplace
  const createdKitties = await kittyCoreInstance.tokensOfOwner(ownerAddress)
  return await kittyMarketPlaceInstance.createOffer(createdKitties[0], initialKittyPrice, {from : ownerAddress})
};
