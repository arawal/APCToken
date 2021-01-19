pragma solidity ^0.5.6;

import './APCToken.sol';

contract APCTokenSale {
  address admin;
  APCToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;

  event Sell(address _buyer, uint256 _amount);

  constructor(APCToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  //multiply
  // internal = only inside contract
  // pure = nothing to do with blckchain, just helper
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  // buy tokens
  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == multiply(_numberOfTokens, tokenPrice));
    require(_numberOfTokens <= tokenContract.balanceOf(address(this)));
    require(tokenContract.transfer(msg.sender, _numberOfTokens));
    tokensSold += _numberOfTokens;
    emit Sell(msg.sender, _numberOfTokens);
  }
  // provision tokens for sale
}
