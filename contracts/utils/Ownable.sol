pragma solidity ^0.5.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {

  /**
   * @dev Adds multiple owners.
   * @dev Returns true if address is in ownerlist
   */
  mapping (address => bool) ownerList;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public{
    ownerList[msg.sender] = true;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(ownerList[msg.sender] == true, "Function restricted to owner");
    _;
  }

  /**
   * @dev Adds _newOwner to mapping ownerList
   */
  function addOwner (address _newOwner) public onlyOwner {
    if (_newOwner != address(0)) {
      ownerList[_newOwner] = true;
    }
  }

  /**
   * @dev Remove _ownerAddress from mapping ownerList
   */
   function removeOwner (address _ownerAddress) public onlyOwner {
     if (_ownerAddress != address(0)) {
       ownerList[_ownerAddress] = false;
     }
   }


}
