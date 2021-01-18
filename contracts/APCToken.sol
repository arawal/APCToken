pragma solidity ^0.5.6;

contract APCToken {
  // constructor
  // set # of tokens
  // read # of tokens

  uint256 public totalSupply; // named from ERC20 std

  constructor() public {
    totalSupply = 1000000;
  }
}
