const Marketplace = artifacts.require("./KittyMarketPlace");
const Kittycontract = artifacts.require("./KittyCore");

module.exports = function(deployer) {
  console.log(Kittycontract.address)
  deployer.deploy(Marketplace, Kittycontract.address);
};
