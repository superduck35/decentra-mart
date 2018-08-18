var DMartAdmin = artifacts.require("./DMartAdmin.sol");
var DMartStore = artifacts.require("./DMartStore.sol");
var DMartStoreFactory = artifacts.require("./DMartStoreFactory.sol");
var DMartStoreManagement = artifacts.require("./DMartStoreManagement.sol");


module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(DMartAdmin)
    await deployer.deploy(DMartStore, "template", 0, 100)
    await deployer.deploy(DMartStoreFactory, DMartStore.address)
    await deployer.deploy(DMartStoreManagement, DMartAdmin.address, DMartStoreFactory.address)
  });
}
