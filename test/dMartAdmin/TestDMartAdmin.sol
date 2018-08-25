pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/DMartAdmin.sol";
import "../TestHelper.sol";

contract TestDMartAdmin {
    
    string private constant ROLE_ADMIN = "Admin";
    string private constant ROLE_STORE_OWNER = "Store Owner";

    DMartAdmin admin;
    TestHelper helper;

    address private constant address_1 = address(0xdD460A903488c988f2F092fEE7c3CC22254b5264);
    address private constant address_2 = address(0x200C0dDbf0467bEF9F284d35902C8ABc9a566790);

    // set the state for tests
    function beforeAll() public {
        admin = new DMartAdmin();
        helper = new TestHelper();
    }

  /**
   *  Ensure that the contract instantiates the owner correctly
   */
    function testOwnerHasCorrectRoles() public {
        Assert.isTrue(admin.hasRole(address(this), ROLE_ADMIN), "Sender should receive admin role");
        Assert.isTrue(admin.owner() == address(this), "Sender should be owner of the contract");
    }
    
  /**
   *  Check that store owner is created and added to internal storage
   */
    function testStoreOwnerIsAddedCorrectly() public {
        
        admin.addStoreOwner(address_1);
        Assert.isTrue(admin.hasRole(address_1, ROLE_STORE_OWNER), "User should have the store owner role");

        uint indexOfOwner = admin.indexOfStoreOwners(address_1);
        Assert.equal(admin.storeOwners(indexOfOwner), address_1, "Store owner correctly stored in data structure");
    }

   /**
   *  Check that store owner is removed from internal storage when deleted
   */
    function testStoreOwnerIsRemovedCorrectly() public {
        admin.removeStoreOwner(address_1);
        Assert.isFalse(admin.hasRole(address_1, ROLE_STORE_OWNER), "User should no longer have the store owner role");

        Assert.isTrue(admin.getStoreOwners().length == 0 && admin.indexOfStoreOwners(address_1) == 0, "Store owner should no longer have an index in array");
    }


  /**
   *  Test the input requirements when adding a store owner
   */
    function testStoreOwnerMustHaveAddress() public {       
        Assert.isFalse(helper.execute("addEmptyStoreOwner()"), "Should fail input requirements");
    }        
    function addEmptyStoreOwner() public {
        admin.addStoreOwner(address(0));
    }


   /**
    *  Ensure that store owner can only be added by admin
    */
    function testStoreOwnerMustBeAddedByAdmin() public {
        admin.removeAdmin(address(this));
        require(!admin.hasRole(address(this), ROLE_ADMIN));
        Assert.isFalse(helper.execute("addStoreOwnerWithoutAdminRole()"), "Should fail input requirements");
    }
    function addStoreOwnerWithoutAdminRole() public {
        admin.addStoreOwner(address_2);
    }

}