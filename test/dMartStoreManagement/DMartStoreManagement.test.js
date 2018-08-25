const {
  assertRevert
} = require('../helpers/assertRevert');

const DMartStoreManagement = artifacts.require("DMartStoreManagement");
const DMartAdmin = artifacts.require("DMartAdmin");

/**
 * All tests regarding the Store Management
 */
contract("DMartStoreManagement", accounts => {
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];

  const ROLE_STORE_OWNER = "Store Owner";
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  /**
   * Basic owner setting
   */
  it("sets an owner", async () => {
    const contract = await DMartStoreManagement.deployed();
    assert.equal(await contract.owner(), firstAccount);
  });

  /**
   * Ensure input type checks work
   */
  it("should not allow null parameters", async () => {
    assertRevert(DMartStoreManagement.new(ZERO_ADDRESS, ZERO_ADDRESS));
  });

  /**
   * Test the whole adding a store process
   */
  describe('adding a new store', () => {
    /**
     * Set up and maintain the core state
     */
    beforeEach(async () => {
      this.manager = await DMartStoreManagement.deployed();
      this.admin = await DMartAdmin.deployed();
      if (!await this.admin.hasRole(firstAccount, ROLE_STORE_OWNER)) {
        await this.admin.addStoreOwner(firstAccount);
      }
    });

    /**
     * Ensure RBAC has been applied correctly
     */
    it("cannot be added by user without store owner role", async () => {
      await assert.isFalse(await this.admin.hasRole(secondAccount, ROLE_STORE_OWNER));
      assertRevert(this.manager.addStore("storeName", {
        from: secondAccount
      }));
    });

    /**
     * Ensure RBAC has been applied correctly
     */
    it("can be added by user with store owner role", async () => {
      await assert.isTrue(await this.admin.hasRole(firstAccount, ROLE_STORE_OWNER));
      assert(this.manager.addStore("storeName"));
    });

    /**
     * Ensure emergency stop has been applied correctly
     */
    it("cannot be added when paused", async () => {
      await this.manager.pause();
      await assert.isTrue(await this.manager.paused());
      assertRevert(this.manager.addStore("storeName"));
      await this.manager.unpause();
    });

    /**
     * Ensure store is created and persisted correctly
     */
    it("saves new store to mapping", async () => {
      const startArr = await this.manager.getStoresByOwner(firstAccount);
      await assert.isTrue(await this.admin.hasRole(firstAccount, ROLE_STORE_OWNER));
      await this.manager.addStore("storeName");
      const newStoresArr = await this.manager.getStoresByOwner(firstAccount);
      assert.isTrue(newStoresArr.length == (startArr.length + 1));
    });
  });
});
