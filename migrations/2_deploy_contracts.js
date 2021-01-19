const APCToken = artifacts.require("APCToken");
const APCTokenSale = artifacts.require("APCTokenSale");

module.exports = function (deployer) {
  deployer.deploy(APCToken, 1000000).then(function () {
    // price = 0.001 ether
    var tokenPrice = 1000000000000000; //in wei
    return deployer.deploy(APCTokenSale, APCToken.address, tokenPrice);
  })

};
