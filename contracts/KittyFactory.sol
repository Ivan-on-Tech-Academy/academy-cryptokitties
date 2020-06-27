pragma solidity ^0.5.0;

contract KittyFactory {

  /*
  *   A new cat is born
  */
  event Birth(address owner, uint256 kittyId, uint256 momId, uint256 dadId, uint256 genes);

  /*
  *   A cat has been transfer
  */
  event Transfer(address from, address to, uint256 tokenId);

  /*
  *   Here we will use the same structure as the original crypto kitties game
  *   As it fit exactly into two bit words
  */

  struct BreedingAssistant {
    address requestor;
    uint256 dadId;
    uint256 momId;
    uint256 randomNumber;
    uint256 kidGen;
    uint256 geneKid;
  }

  mapping (bytes32 => BreedingAssistant) public breedingAssistant;


  struct Kitty {

      uint256 genes;
      uint64 birthTime;
      uint32 momId;
      uint32 dadId;
      uint16 generation;
  }

  Kitty[] kitties;

  mapping (uint256 => address) public kittyIndexToOwner;
  mapping (address => uint256) ownershipTokenCount;

  // Add a list of approved kitties, that are allowed to be transfered
  mapping (uint256 => address) public kittyIndexToApproved;


  function _createKitty(
      bytes32 _requestId
  )
      internal
      returns (uint)
  {

    Kitty memory _kitty = Kitty({
        genes: breedingAssistant[_requestId].geneKid,
        birthTime: uint64(now),
        momId: uint32(breedingAssistant[_requestId].momId),
        dadId: uint32(breedingAssistant[_requestId].dadId),
        generation: uint16(breedingAssistant[_requestId].kidGen)
    });

    uint256 newKittenId = kitties.push(_kitty) - 1;

    // It's probably never going to happen, 4 billion cats is A LOT, but
    // let's just be 100% sure we never let this happen.
    require(newKittenId == uint256(uint32(newKittenId)));

    // emit the birth event
    emit Birth(
        breedingAssistant[_requestId].requestor,
        newKittenId,
        uint256(breedingAssistant[_requestId].momId),
        uint256(breedingAssistant[_requestId].dadId),
        _kitty.genes
    );

    // This will assign ownership, and also emit the Transfer event as
    // per ERC721 draft
    _transfer(address(0), breedingAssistant[_requestId].requestor, newKittenId);

    // Deleting breedingAssistant for given _requestId
    delete (breedingAssistant[_requestId]);

    return newKittenId;
  }

  function _transfer(address _from, address _to, uint256 _tokenId) internal {

    // Since the number of kittens is capped to 2^32 we can't overflow this
    ownershipTokenCount[_to]++;
    // transfer ownership
    kittyIndexToOwner[_tokenId] = _to;

    if (_from != address(0)) {
        ownershipTokenCount[_from]--;

        delete kittyIndexToApproved[_tokenId];
    }

    // Emit the transfer event.
    emit Transfer(_from, _to, _tokenId);
  }
}
