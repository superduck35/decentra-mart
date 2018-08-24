pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/DMartStore.sol";

contract TestDMartStore {
  function testDmartStore() {
    DMartStore store = DMartStore(DeployedAddresses.DMartStore());


    Assert.equal(store.open(), true, "Store should be open initially");
  }
}