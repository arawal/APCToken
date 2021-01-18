var APCToken = artifacts.require("APCToken.sol")

contract('APCToken', function (accounts) {
  var tokenInstance;

  it('initializes contract', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function (name) {
      assert.equal(name, "APCToken", "has a name")
      return tokenInstance.symbol();
    }).then(function (symbol) {
      assert.equal(symbol, "APC", "has a symbol")
      return tokenInstance.standard();
    }).then(function (standard) {
      assert.equal(standard, "APC Token v1.0", "has a standard")
    });
  });

  it('allocates the initial supply upon deployment', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function (totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, "sets total supply")
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (adminBalance) {
      assert.equal(adminBalance.toNumber(), 1000000, 'allocates initial supply to admin')
    });
  });

  it('transfers tokens', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;

      return tokenInstance.transfer.call(accounts[1], 999999999999999);
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'error should contain revert');
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then(function (success) {
      assert(success, true, 'returns bool');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers event')
      assert.equal(receipt.logs[0].event, 'Transfer', 'event is transfer')
      assert.equal(receipt.logs[0].args._from, accounts[0], 'from is good')
      assert.equal(receipt.logs[0].args._to, accounts[1], 'to is good')
      assert.equal(receipt.logs[0].args._value, 250000, 'value is good')
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 250000, 'sends tokens')
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 750000, 'deducts tokens')
    });
  });
});
