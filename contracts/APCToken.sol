pragma solidity ^0.5.6;

contract APCToken {
  string public name = "APCToken";
  string public symbol = "APC";
  string public standard = "APC Token v1.0";
  uint256 public totalSupply; // named from ERC20 std

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  constructor(uint256 _initialSupply) public {
    // allocate initial supply
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value, "insufficient balance");

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);

    return true;
  }
}
