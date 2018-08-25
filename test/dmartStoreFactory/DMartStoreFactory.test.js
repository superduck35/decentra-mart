const {
  assertRevert
} = require('../helpers/assertRevert');
const DMartStoreFactory = artifacts.require("DMartStoreFactory");
const DMartStore = artifacts.require("DMartStore");

/**
 * Proxy Factory test
 */
contract("DMartStoreFactory", accounts => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  /**
   * Ensure factory creation fails when using incorrect inputs
   */
  describe('basic factory creation', function () {
    it("should error when setting null address", async () => {
      await assertRevert(
        DMartStoreFactory.new(ZERO_ADDRESS)
      );
    });
  });
});
