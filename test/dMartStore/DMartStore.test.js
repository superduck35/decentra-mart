const {
  assertRevert
} = require('../helpers/assertRevert');
const DMartStore = artifacts.require("DMartStore");


/**
 * Testing the core store contract
 */
contract("DMartStore", accounts => {
  const firstAccount = accounts[0];
  const storeOwner = accounts[0];
  const secondAccount = accounts[1];
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  /**
   * Run through a store being created and ensure that it works as intended
   */
  describe('basic store creation', function () {
    it("should set the correct owner", async () => {
      let store = await DMartStore.deployed();
      assert.equal(await store.owner(), firstAccount);

    });
    /**
     * Checking that the initialisation of the store can only happen once
     * Since this is a proxied contract, we put the logic here rather than in the constructor
     */
    it("cannot initialise twice", async () => {
      let store = await DMartStore.deployed();
      assertRevert(store.init(firstAccount, "tester"));
    });
  });

  /**
   * Ensuring that once the product is created, it gets successfully added
   * to the data structure for further access
   */
  describe('adding a product', function () {
    it("should add product to stock list", async () => {
      let store = await DMartStore.deployed();
      await store.addNewProduct("product", web3.toWei(0.1, 'ether'), 50);
      const newProduct = await store.getProduct(0);
      assert.equal(newProduct[1], "product");
    });
  });

  /**
   * A product that has been added to the store can be purchased by customers
   * Here we set up pre-test state to ensure the product is there and has stock
   */
  describe('purchasing a product', function () {
    beforeEach(async () => {
      this.store = await DMartStore.deployed();
      if (await this.store.numberOfProducts() == 0) {
        await this.store.addNewProduct("product", web3.toWei(0.1, 'ether'), 50);
      }
    });

    /**
     * A purchase makes the stock of the product decrease in the store
     * Checking the stock before and after the purchase
     */
    it("should decrease the stock amount", async () => {
      const productBefore = await this.store.getProduct(0);
      await this.store.purchaseProduct(0, {
        from: secondAccount,
        value: web3.toWei(0.1, 'ether')
      });
      const productAfter = await this.store.getProduct(0);
      assert.equal(parseInt(productBefore[3]), parseInt(productAfter[3]) + 1);
    });

    /**
     * The purchase of the product shouldn't go through if there is not enough 
     * ether in the payload
     */
    it("should error if missing ether", async () => {
      assertRevert(this.store.purchaseProduct(0, {
        from: secondAccount,
        value: web3.toWei(0.05, 'ether')
      }));
    });

    /**
     * Ensure that the Ether being sent in the transaction gets deposited into the 
     * stores balance, so that the owner can withdraw it later
     */
    it("should credit the shop balance", async () => {
      const balanceBefore = await web3.eth.getBalance(this.store.address);
      await this.store.purchaseProduct(0, {
        from: secondAccount,
        value: web3.toWei(0.1, 'ether')
      });
      const balanceAfter = await web3.eth.getBalance(this.store.address);
      assert.equal(parseInt(balanceBefore) + parseInt(web3.toWei(0.1, 'ether')), parseInt(balanceAfter));
    });
  });
})
