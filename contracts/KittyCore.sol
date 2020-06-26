import "./utils/Ownable.sol";
import "./KittyMarketPlace.sol";

pragma solidity ^0.5.0;

contract KittyCore is Ownable, KittyMarketPlace {

  uint256 public constant CREATION_LIMIT_GEN0 = 10;

  // Counts the number of cats the contract owner has created.
  uint256 public gen0Counter;

  constructor() public {
    // We are creating the first kitty at index 0  
    _createKitty(0, 0, 0, uint256(-1), address(0));
  }

  function Breeding(uint256 _dadId, uint256 _mumId) public {
      require(_owns(msg.sender, _dadId), "The user doesn't own the token");
      require(_owns(msg.sender, _mumId), "The user doesn't own the token");

      ( uint256 Dadgenes,,,,uint256 DadGeneration ) = getKitty(_dadId);

      ( uint256 Mumgenes,,,,uint256 MumGeneration ) = getKitty(_mumId);

      uint256 i;
      uint256 geneKid;

      for(i=1; i <= 128; i=i*2){
          if(now % 255 & i != 0){
              geneKid += Mumgenes % 100;
          } else {
              geneKid +=  Dadgenes % 100;
          }
          Mumgenes /= 100;
          Dadgenes /= 100;
          if (i < 128){
              geneKid *= 100;
          }
      }

      uint256 kidGen = 0;
      if (DadGeneration < MumGeneration){
        kidGen = MumGeneration + 1;
        kidGen /= 2;
      } else if (DadGeneration > MumGeneration){
        kidGen = DadGeneration + 1;
        kidGen /= 2;
      } else{
        kidGen = MumGeneration;
      }

      _createKitty(_mumId, _dadId, kidGen, geneKid, msg.sender);
  }


  function createKittyGen0(uint256 _genes) public onlyOwner {
    require(gen0Counter < CREATION_LIMIT_GEN0);

    gen0Counter++;

    // Gen0 have no owners they are own by the contract
    uint256 tokenId = _createKitty(0, 0, 0, _genes, msg.sender);
    setOffer(0.2 ether, tokenId);
  }

  function getKitty(uint256 _id)
    public
    view
    returns (
    uint256 genes,
    uint256 birthTime,
    uint256 mumId,
    uint256 dadId,
    uint256 generation
  ) {
    Kitty storage kitty = kitties[_id];

    require(kitty.birthTime > 0, "the kitty doesn't exist");

    birthTime = uint256(kitty.birthTime);
    mumId = uint256(kitty.mumId);
    dadId = uint256(kitty.dadId);
    generation = uint256(kitty.generation);
    genes = kitty.genes;
  }
}