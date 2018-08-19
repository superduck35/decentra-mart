pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DMartStore.sol";

contract TestDMartStore {
  function testDmartStore() {
    DMartStore meta = DMartStore(DeployedAddresses.DMartStore());


    Assert.equal(meta.getName(), "template", "Own");
  }
}