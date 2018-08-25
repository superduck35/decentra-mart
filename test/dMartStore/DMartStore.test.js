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
   * Store creation and initialisation
   */
  describe('basic store creation', function () {
    it("should set the correct owner", async () => {
      let store = await DMartStore.deployed();
      assert.equal(await store.owner(), firstAccount);

    });
    /**
     * Ensuring initialisation can only happen once
     */
    it("cannot initialise twice", async () => {
      let store = await DMartStore.deployed();
      assertRevert(store.init(firstAccount, "tester"));
    });
  });

  /**
   * Product is created and added to storage correctly
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
   * Product can be purchased
   */
  describe('purchasing a product', function () {
    beforeEach(async () => {
      this.store = await DMartStore.deployed();
      if (await this.store.numberOfProducts() == 0) {
        await this.store.addNewProduct("product", web3.toWei(0.1, 'ether'), 50);
      }
    });

    /**
     * Product stock decreases
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
     * Customer doesn't send enough Ether
     */
    it("should error if missing ether", async () => {
      assertRevert(this.store.purchaseProduct(0, {
        from: secondAccount,
        value: web3.toWei(0.05, 'ether')
      }));
    });

    /**
     * Shop owner balance increases
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
