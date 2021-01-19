pragma solidity ^0.5.6;

import './APCToken.sol';

contract APCTokenSale {
  address admin;
  APCToken public tokenContract;
  uint256 public tokenPrice;

  constructor(APCToken _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
