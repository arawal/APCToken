const APCToken = artifacts.require("APCToken");

module.exports = function (deployer) {
  deployer.deploy(APCToken);
};
