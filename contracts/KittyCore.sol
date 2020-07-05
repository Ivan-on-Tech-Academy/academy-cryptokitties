import "./utils/Ownable.sol";
import "./KittyMarketPlace.sol";

/*
* VRFConsumerBase required to call the oracle
*/
import "./utils/link/VRFConsumerBase.sol"; /* https://docs.chain.link/docs/chainlink-vrf */



pragma solidity ^0.5.0;

contract KittyCore is Ownable, KittyMarketPlace, VRFConsumerBase {

  using SafeMath for uint256;

  uint256 public constant CREATION_LIMIT_GEN0 = 10;


  // Counts the number of cats the contract owner has created.
  uint256 public gen0Counter;


  /* Provided by the oracle (it's the public key against which randomness is generated) */
  bytes32 internal keyHash;

  /* The oracle's fee is set to 1 link  */
  uint256 internal fee;


  /*
  * In struct 'requests' we save the data we need to call Breeding ()
  * once the random number is returned by the oracle.
  *
  * In order to access request we use the bytes32 _requestId provided from getRandomNumber ()
  */


  struct Requests {

    address requestor;
    uint256 dadId;
    uint256 mumId;
    uint256 randomNumber;
  }

  mapping (bytes32 => Requests) internal request;

  /* RequestRandomness is emitted after calling the oracle from KittyCore  */
  event RequestRandomness(bytes32 indexed requestId,bytes32 keyHash,uint256 seed);


  /* RequestRandomnessFulfilled is emitted once the random number is returned  */
  event RequestRandomnessFulfilled(bytes32 indexed requestId,uint256 randomness);



  /*
    _vrfCoordinator: 0xf720CF1B963e0e7bE9F58fd471EFa67e7bF00cfb
    _link:           0x20fE562d797A42Dcb3399062AE9546cd06f63280
  */

  constructor(address _vrfCoordinator, address _link)
  VRFConsumerBase(_vrfCoordinator, _link) public { // Refer to VRFConsumerBase for more info

    vrfCoordinator = _vrfCoordinator;
    LINK = LinkTokenInterface(_link);
    keyHash = 0xced103054e349b8dfb51352f0f8fa9b5d20dde3d06f9f43cb2b85bc64b238205; // hard-coded for Ropsten
    fee = 10 ** 18;


    // We are creating the first kitty at index 0
    _createKitty(0, 0, 0, uint256(-1), address(0));
  }


  function getRandomNumber (
    address _requestor,
    uint256 _userProvidedSeed,
    uint256 _dadId,
    uint256 _mumId

  ) internal {

    uint256 seed = uint256(keccak256(abi.encode(_userProvidedSeed, blockhash(block.number)))); // Hash user seed and blockhash

    bytes32 requestId = requestRandomness(keyHash, fee, seed);

    request[requestId].requestor = _requestor;
    request[requestId].dadId = _dadId;
    request[requestId].mumId = _mumId;

    emit RequestRandomness(requestId, keyHash, seed);
  }


  function fulfillRandomness(bytes32 _requestId, uint256 _randomness) external {

    request[_requestId].randomNumber = _randomness.mod(255);

    emit RequestRandomnessFulfilled(_requestId, _randomness);

    Breeding(_requestId);
  }


  /*
  * breed must be used to trigger the oracle
  * getRandomNumber () is called
  * fulfillRandomness () calls Breeding() once the random number is created
  */

  function breed (uint256 _seed, uint256 _dadId, uint256 _mumId) public {

    require(_owns(msg.sender, _dadId), "The user doesn't own the token");

    require(_owns(msg.sender, _mumId), "The user doesn't own the token");

    require(_mumId != _dadId, "The cat can't reproduce himself");

    uint256 linkBalance = LINK.balanceOf(address(this));

    require (linkBalance >= 10 ** 18, "Deposit 1 link token");

    getRandomNumber(msg.sender, _seed,  _dadId,  _mumId);

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

  function Breeding(bytes32 _requestId) public {

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

    /* Below declaration 'requestor'
    * needed to avoid **too many nested var ** error
    * when calling _createKitty
    */
    address requestor = request[_requestId].requestor;

    _createKitty(
      request[_requestId].mumId,
      request[_requestId].dadId,
      kidGen,
      geneKid,
      requestor
    );
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
