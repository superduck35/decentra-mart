const DMartAdmin = artifacts.require("DMartAdmin");

contract("DMartAdmin", accounts => {
  const firstAccount = accounts[0];

  it("sets an owner", async () => {
    const admin = await DMartAdmin.new();
    assert.equal(await admin.owner(), firstAccount);
  });

  //   it("should put 10000 MetaCoin in the first account", function() {
  //     return MetaCoin.deployed().then(function(instance) {
  //       return instance.getBalance.call(accounts[0]);
  //     }).then(function(balance) {
  //       assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  //     });
  //   });
});
