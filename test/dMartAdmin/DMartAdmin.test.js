const {
  assertRevert
} = require('../helpers/assertRevert');
const DMartAdmin = artifacts.require("DMartAdmin");

/**
 *  Admin contract tests
 */
contract("DMartAdmin", accounts => {
  const firstAccount = accounts[0];
  const secondAccount = accounts[1];
  const thirdAccount = accounts[2];

  const ROLE_ADMIN = "Admin";
  const ROLE_STORE_OWNER = "Store Owner";

  /**
   *  Test that the correct owner is assigned when creating instance
   */
  it("should set the correct owner", async () => {
    const admin = await DMartAdmin.new();
    assert.equal(await admin.owner(), firstAccount);
  });

  /**
   *  Tests concerning the adding and removal of admin role by various parties
   */
  describe('adding an admin', () => {
    beforeEach(async () => {
      this.admin = await DMartAdmin.deployed();
    });
    /**
     *  Allow owner to set admin role and check it has been applied
     */
    it("should set the admin role", async () => {
      await this.admin.addAdmin(secondAccount);
      assert.isTrue(await this.admin.hasRole(secondAccount, ROLE_ADMIN));
    });
    /**
     *  Allow owner to remove the admin role
     */
    it("should remove the admin role", async () => {
      await this.admin.removeAdmin(secondAccount);
      assert.isFalse(await this.admin.hasRole(secondAccount, ROLE_ADMIN));
    });
    /**
     *  An admin cannot add another admin 
     */
    it("should not let admin add a role", async () => {
      await assertRevert(this.admin.addAdmin(thirdAccount, {
        from: secondAccount
      }));
    });
    /**
     *  Ensure that the admin cant remove a role
     */
    it("should not let admin remove a role", async () => {
      await assertRevert(this.admin.removeAdmin(secondAccount, {
        from: secondAccount
      }));
    });
  });
});
