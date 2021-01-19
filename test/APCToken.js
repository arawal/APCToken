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

  it('approve delegated transfer', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;

      return tokenInstance.approve.call(accounts[3], 100);
    }).then(function (success) {
      assert.equal(success, true, 'approved');
      return tokenInstance.approve(accounts[3], 100);
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers event')
      assert.equal(receipt.logs[0].event, 'Approval', 'event is approval')
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'owner is good')
      assert.equal(receipt.logs[0].args._spender, accounts[3], 'spender is good')
      assert.equal(receipt.logs[0].args._value, 100, 'value is good')
      return tokenInstance.allowance(accounts[0], accounts[3]);
    }).then(function (allowance) {
      assert.equal(allowance, 100, 'allowance accurate')
    })
  });

  it('approve delegated transfer', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];

      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function (receipt) {
      // approve spendingaccount to spend 10 tokens from fromaccount
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function (receipt) {
      // try transfering more than balance
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot spend more than balance')
      // try transfering more than allowance
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot spend more than allowance');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function (success) {
      assert.equal(success, true);
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers event')
      assert.equal(receipt.logs[0].event, 'Transfer', 'event is transfer')
      assert.equal(receipt.logs[0].args._from, accounts[2], 'from is good')
      assert.equal(receipt.logs[0].args._to, accounts[3], 'to is good')
      assert.equal(receipt.logs[0].args._value, 10, 'value is good')
      return tokenInstance.balanceOf(fromAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 90, 'amount deducted')
      return tokenInstance.balanceOf(toAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 10, 'amount added')
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function (allowance) {
      assert.equal(allowance.toNumber(), 0, 'allowance deducted');
    })
  });
});
