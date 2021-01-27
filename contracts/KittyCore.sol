import "./utils/Ownable.sol";
import "./KittyFactory.sol";
import "./utils/link/Randomizer.sol";

pragma solidity ^0.5.0;

contract KittyCore is KittyFactory, Ownable, Randomizer {

  using SafeMath for uint256;


  uint256 public constant CREATION_LIMIT_GEN0 = 10;


  // Counts the number of cats the contract owner has created.
  uint256 public gen0Counter;


  /*
    _vrfCoordinator: 0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb
    _link:           0x20fE562d797A42Dcb3399062AE9546cd06f63280
  */
  constructor(address _vrfCoordinator, address _link)
  VRFConsumerBase(_vrfCoordinator, _link) public { // Refer to VRFConsumerBase for more info

    keyHash = 0xced103054e349b8dfb51352f0f8fa9b5d20dde3d06f9f43cb2b85bc64b238205; // hard-coded for Ropsten
    fee = 10 ** 18;

    // We are creating the first kitty at index 0
    _createKitty(0, 0, 0, uint256(-1), msg.sender);
  }


  /*
  * @dev Generate new ERC721 token.
  * @param _seed A random number required by the oracle.
  * @param _dadId && _mumId 2* Erc721 owned by the same msg.sender.
  * @notice getRandomNumber () is called is _usingOracle = true.
  * @notice fulfillRandomness () will get the random number.
  */
  function breed (uint256 _seed, uint256 _dadId, uint256 _mumId, bool _usingOracle) public {

    require(ownerOf(_dadId) == msg.sender, "msg.sender ! own the dad");

    require(ownerOf(_mumId) == msg.sender, "msg.sender ! own the mum");

    require(_mumId != _dadId, "The cat can't reproduce himself");

    if (_usingOracle == false) { // If _usingOracle param is missing == false
      bytes32 fooParam = keccak256(abi.encodePacked(msg.sender, _seed));
      request[fooParam].requestor = msg.sender;
      request[fooParam].dadId = _dadId;
      request[fooParam].mumId = _mumId;
      request[fooParam].randomNumber = now % 255;
      Breeding(fooParam);
    } else {
      uint256 linkBalance = LINK.balanceOf(address(this));
      require (linkBalance >= 10 ** 18, "Deposit 1 link token");
      getRandomNumber(msg.sender, _seed,  _dadId,  _mumId);
    }
  }


  /*
  *       we get a
  *
  *       Basic binary operation
  *
  *       >>> '{0:08b}'.format(255 & 1)
  *       '00000001'
  *       >>> '{0:08b}'.format(255 & 2)
  *       '00000010'
  *       >>> '{0:08b}'.format(255 & 4)
  *       '00000100'
  *       >>> '{0:08b}'.format(255 & 8)
  *       '00001000'
  *       >>> '{0:08b}'.format(255 & 16)
  *       '00010000'
  *       >>> '{0:08b}'.format(255 & 32)
  *       '00100000'
  *       >>> '{0:08b}'.format(255 & 64)
  *       '01000000'
  *       >>> '{0:08b}'.format(255 & 128)
  *       '10000000'
  *
  *       So we use a mask on our random number to check if we will use the mumID or the dadId
  *
  *       For example 205 is 11001101 in binary So
  *       mum - mum - dad -dad -mum - mum - dad - mum
  *
  */

  function Breeding (bytes32 _requestId) private {

    ( uint256 Dadgenes,,,,uint256 DadGeneration ) = getKitty(request[_requestId].dadId);

    ( uint256 Mumgenes,,,,uint256 MumGeneration ) = getKitty(request[_requestId].mumId);

    uint256 geneKid;
    uint256 [8] memory geneArray;
    uint256 index = 7;
    uint256 i = 0;

    for(i = 1; i <= 128; i=i*2){

        /* We are */
        if(request[_requestId].randomNumber & i != 0){
            geneArray[index] = uint8(Mumgenes % 100);
        } else {
            geneArray[index] = uint8(Dadgenes % 100);
        }
        Mumgenes /= 100;
        Dadgenes /= 100;
      index -= 1;
    }

    /* Add a random parameter in a random place */
    uint256 newGeneIndex =  request[_requestId].randomNumber % 7;
    geneArray[newGeneIndex] = request[_requestId].randomNumber % 99;

    /* We reverse the DNa in the right order */
    for (i = 0 ; i < 8; i++ ){
      geneKid += geneArray[i];
      if(i != 7){
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
      kidGen = MumGeneration + 1;
    }

    /**
    * @dev address requestor needed to avoid **too many nested var ** error
    *      when calling _createKitty.
    *
    */
    address requestor = request[_requestId].requestor;

    _createKitty(
      request[_requestId].mumId,
      request[_requestId].dadId,
      kidGen,
      geneKid,
      requestor
    );

    /**
    * @dev Because is not needed anymore, deleting struct content for _requestId
    */
    delete (request[_requestId]);
  }

  function fulfillRandomness(bytes32 _requestId, uint256 _randomness) external {

    request[_requestId].randomNumber = _randomness.mod(255);

    emit RequestRandomnessFulfilled(_requestId, _randomness);

    Breeding(_requestId);
  }

  /**
  * @dev All kitties gen0 created will be owned by msg.sender.
  */
  function createKittyGen0(uint256 _genes) public onlyOwner {
    require(gen0Counter < CREATION_LIMIT_GEN0,"Gen0 limit reached");

    gen0Counter++;

    _createKitty(0, 0, 0, _genes, msg.sender);
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

  function tokensOfOwner(address _owner) public view returns(uint256[] memory ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
        return new uint256[](0);
    } else {
        uint256[] memory result = new uint256[](tokenCount);
        uint256 totalCats = totalSupply();
        uint256 resultIndex = 0;

        uint256 catId;

        for (catId = 1; catId <= totalCats; catId++) {
            if (kittyIndexToOwner[catId] == _owner) {
                result[resultIndex] = catId;
                resultIndex++;
            }
        }

        return result;
    }
  }

  function totalSupply() public view returns (uint) {
      return kitties.length - 1;
  }

  function _deleteApproval(uint256 _tokenId) internal {
      require(ownerOf(_tokenId) == msg.sender, "msg.sender ! own the _tokenId");
      delete kittyIndexToApproved[_tokenId];
  }


  /*
  * Set the address of the deployed VRFCoordinator you wish to interact with
  */

  function set_vrfCoordinator (address _new) public onlyOwner returns (bool) {

    require (_new != address(0),"Invalid address");

    vrfCoordinator = _new;

    return true;
  }

  /*
  * Set the address of the LINK token used for payment
  */

  function set_link (address _new) public onlyOwner returns (bool) {

    require (_new != address(0),"Invalid address");

    LINK = LinkTokenInterface(_new);

    return true;
  }
}
