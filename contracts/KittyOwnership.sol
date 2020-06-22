pragma solidity ^0.5.0;

import "./KittyFactory.sol";

contract KittyOwnership is KittyFactory{

  event Transfer(address from, address to, uint256 tokenId);
  event Approval(address owner, address approved, uint256 tokenId);


  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return kittyIndexToOwner[_tokenId] == _claimant;
  }

  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return kittyIndexToApproved[_tokenId] == _claimant;
  }

  function _approve(uint256 _tokenId, address _approved) internal {
      kittyIndexToApproved[_tokenId] = _approved;
  }


  /*
  *   Function required by the erc 721 interface
  */

  function totalSupply() public view returns (uint) {
      return kitties.length - 1;
  }

  function balanceOf(address _owner) public view returns (uint256 count) {
      return ownershipTokenCount[_owner];
  }

  function ownerOf(uint256 _tokenId)
      external
      view
      returns (address owner)
  {
      owner = kittyIndexToOwner[_tokenId];

      require(owner != address(0));
  }

  function approve(
      address _to,
      uint256 _tokenId
  )
      external
  {
      // Only an owner can grant transfer approval.
      require(_owns(msg.sender, _tokenId));

      // Register the approval (replacing any previous approval).
      _approve(_tokenId, _to);

      // Emit approval event.
      emit Approval(msg.sender, _to, _tokenId);
  }

  function transfer(
      address _to,
      uint256 _tokenId
  )
      external
  {
      // Safety check to prevent against an unexpected 0x0 default.
      require(_to != address(0));

      // Disallow transfers to this contract to prevent accidental misuse.
      require(_to != address(this));

      // You can only send your own cat.
      require(_owns(msg.sender, _tokenId));

      // Reassign ownership, clear pending approvals, emit Transfer event.
      _transfer(msg.sender, _to, _tokenId);
  }

  function transferFrom(
      address _from,
      address _to,
      uint256 _tokenId
  )
      external
  {
      // Safety check to prevent against an unexpected 0x0 default.
      require(_to != address(0));
      // Disallow transfers to this contract to prevent accidental misuse.
      require(_to != address(this));

      // Check for approval and valid ownership
      require(_approvedFor(msg.sender, _tokenId));
      require(_owns(_from, _tokenId));

      // Reassign ownership (also clears pending approvals and emits Transfer event).
      _transfer(_from, _to, _tokenId);
  }
}