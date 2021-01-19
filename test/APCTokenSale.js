const APCTokenSale = artifacts.require("APCTokenSale");
const APCToken = artifacts.require("APCToken");

contract("APCTokenSale", function (accounts) {
  var tokenSaleInstance;
  var tokenInstance;
  var tokenPrice = 1000000000000000; //in wei
  var buyer = accounts[1]
  var admin = accounts[0]
  var numberOfTokens
  var tokensAvailable = 750000;

  it('initializes', function () {
    return APCTokenSale.deployed().then(function (instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'has contract address')
      return tokenSaleInstance.tokenContract();
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'has token contract')
      return tokenSaleInstance.tokenPrice()
    }).then(function (price) {
      assert.equal(price, tokenPrice, 'token price valid')
    })
  })

  it('facilitates token buying', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return APCTokenSale.deployed()
    }).then(function (instance) {
      tokenSaleInstance = instance;
      // provision 75% tokens for sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
    }).then(function (receipt) {
      numberOfTokens = 10;
      var value = numberOfTokens * tokenPrice;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value })
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers event')
      assert.equal(receipt.logs[0].event, 'Sell', 'event is sell')
      assert.equal(receipt.logs[0].args._buyer, buyer, 'buyer is good')
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'amount is good')
      return tokenSaleInstance.tokensSold()
    }).then(function (amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'sold')
      return tokenInstance.balanceOf(buyer)
    }).then(function (balance) {
      assert.equal(balance.toNumber(), numberOfTokens)
      return tokenInstance.balanceOf(tokenSaleInstance.address)
    }).then(function (balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens)
      // try to buy tokens diff from ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 })
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value < #tokens in wei')
      return tokenSaleInstance.buyTokens(10000000, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'not enough tokens to sell')
    })
  })
})
