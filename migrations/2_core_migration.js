var DMartAdmin = artifacts.require("./DMartAdmin.sol");
var DMartStoreManagement = artifacts.require("./DMartStoreManagement.sol");

module.exports = function (deployer) {
  deployer.deploy(DMartAdmin).then(() => {
    return deployer.deploy(DMartStoreManagement, DMartAdmin.address)
  });
};
