const KittyCore = artifacts.require("KittyCore");
const KittyMarketPlace = artifacts.require("KittyMarketPlace");

module.exports = async (deployer, network, accounts) => {
  const ownerAddress = accounts[0];
  const initialKittyPrice = web3.utils.toWei("0.05", "ether")

  // Deploy contracts
  await deployer.deploy(KittyCore, {from :ownerAddress});
  await deployer.deploy(KittyMarketPlace, KittyCore.address, {from :ownerAddress});
  
  const kittyCoreInstance = await KittyCore.deployed();
  const kittyMarketPlaceInstance = await KittyMarketPlace.deployed();

  // Set first initial offer in marketplace
  const createdKitties = await kittyCoreInstance.tokensOfOwner(ownerAddress)
  const createdKitty = createdKitties[0]
  await kittyCoreInstance.approve(KittyMarketPlace.address,createdKitty)
  await kittyMarketPlaceInstance.createOffer(createdKitty, initialKittyPrice, {from : ownerAddress})
};
