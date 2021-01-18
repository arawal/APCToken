var APCToken = artifacts.require("APCToken.sol")

contract('APCToken', function (accounts) {
  it('sets the total supply upon deployment', function () {
    return APCToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function (totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, "Should be 1M")
    })
  })
})
