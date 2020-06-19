const KittyCore = artifacts.require("./KittyCore");

module.exports = function(deployer) {
  deployer.deploy(KittyCore);
};
