import "./utils/ERC721Contracts/ERC721.sol";

pragma solidity ^0.5.0;

contract KittyFactory is ERC721 {

  string public constant name = "IvanKitties";
  string public constant symbol = "CK";

  event Approval(address owner, address approved, uint256 tokenId);


  /*
  *   A new cat is born
  */
  event Birth(address owner, uint256 kittyId, uint256 mumId, uint256 dadId, uint256 genes);

  /*
  *   A cat has been transfer
  */
  event Transfer(address from, address to, uint256 tokenId);

  /*
  *   Here we will use the same structure as the original crypto kitties game
  *   As it fit exactly into two bit words
  */
  struct Kitty {

      uint256 genes;
      uint64 birthTime;
      uint32 mumId;
      uint32 dadId;
      uint16 generation;
  }

  Kitty[] kitties;

  mapping (uint256 => address) public kittyIndexToOwner;
  mapping (address => uint256) ownershipTokenCount;

  // Add a list of approved kitties, that are allowed to be transfered
  mapping (uint256 => address) public kittyIndexToApproved;

  function _createKitty(
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      uint256 _genes,
      address _owner
  )
      internal
      returns (uint)
  {

    Kitty memory _kitty = Kitty({
        genes: _genes,
        birthTime: uint64(now),
        mumId: uint32(_mumId),
        dadId: uint32(_dadId),
        generation: uint16(_generation)
    });

    uint256 newKittenId = kitties.push(_kitty) - 1;

    // It's probably never going to happen, 4 billion cats is A LOT, but
    // let's just be 100% sure we never let this happen.
    require(newKittenId == uint256(uint32(newKittenId)),"Testing catch error 0");

    // emit the birth event
    emit Birth(
        _owner,
        newKittenId,
        uint256(_kitty.mumId),
        uint256(_kitty.dadId),
        _kitty.genes
    );

    // Creates the kitty 721 token
    _mint (_owner, newKittenId);

    return newKittenId;
  }

}
