import "./utils/Ownable.sol";
import "./KittyOwnership.sol";

pragma solidity ^0.5.0;

contract KittyCore is Ownable, KittyOwnership, KittyMarketPlace {

  uint256 public constant CREATION_LIMIT_GEN0 = 10;

  // Counts the number of cats the contract owner has created.
  uint256 public gen0Counter;

  constructor() public {
    // We are creating the first kitty at index 0  
    _createKitty(0, 0, 0, uint256(-1), address(0));
  }

  function createKittyGen0(uint256 _genes) public onlyOwner {
    require(gen0Counter < CREATION_LIMIT_GEN0);

    gen0Counter++;

    // Gen0 have no owners they are own by the contract
    _createKitty(0, 0, 0, _genes, address(this));
  }

  function getKittyByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownershipTokenCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < kitties.length; i++) {
      if (kittyIndexToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getKitty(uint256 _id)
    external
    view
    returns (
    uint256 genes,
    uint256 birthTime,
    uint256 mumId,
    uint256 dadId,
    uint256 generation
  ) {
    Kitty storage kitty = kitties[_id];

    birthTime = uint256(kitty.birthTime);
    mumId = uint256(kitty.mumId);
    dadId = uint256(kitty.dadId);
    generation = uint256(kitty.generation);
    genes = kitty.genes;
  }
}