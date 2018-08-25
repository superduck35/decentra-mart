pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/DMartStore.sol";
import "../../contracts/DMartStoreFactory.sol";
import "../TestHelper.sol";

contract TestDMartStoreFactory {
    
    DMartStoreFactory factory;
    DMartStore masterCopy;
    TestHelper helper;

    address private constant address_1 = address(0xdD460A903488c988f2F092fEE7c3CC22254b5264);
    address private constant address_2 = address(0x200C0dDbf0467bEF9F284d35902C8ABc9a566790);

    /**
     * Set the state for all the tests
     */
    function beforeAll() public {
        masterCopy = DMartStore(DeployedAddresses.DMartStore());
        factory = new DMartStoreFactory(masterCopy);
        helper = new TestHelper();
    }

    /**
     * Ensure a basic store is created through the factory and it has the correct properties
     */
    function testFactoryCreatesBasicStore() public {
        DMartStore createdStore = factory.createDMartStore(address(this), "storeName");

        Assert.isTrue(createdStore != address(0), "Store should return an address");
        Assert.equal(createdStore.name(), "storeName", "Name storage should display correct value");
        Assert.equal(createdStore.owner(), address(this), "Owner of store should be us");
    }

    /**
     * Check input requirements, store cannot have an empty address as owner
     */
    function assignNullOwner() public {
        factory.createDMartStore(address(0), "storeName");
    }
    function testStoreOwnerCannotBeEmpty() public {
        Assert.isFalse(helper.execute("assignNullOwner()"), "Should not allow creation");
    }

    /**
     * Check input requirements, store cannot have an empty name
     */
    function assignNullName() public {
        factory.createDMartStore(address(this), "");
    }    
    function testStoreNameCannotBeEmpty() public {
        Assert.isFalse(helper.execute("assignNullName()"), "Should not allow creation");
    }

    /**
     * Check input requirements, factory cannot contain a null master copy
     */
    function setEmptyMasterCopy() public {
        new DMartStoreFactory(DMartStore(address(0)));
    }
    function testSetEmptyMasterCopy() public {
        Assert.isFalse(helper.execute("createEmptyFactoryCopy()"), "Should not allow creation");
    }
}