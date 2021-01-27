/*
* VRFConsumerBase required to call the oracle
*/
import "./VRFConsumerBase.sol"; /* https://docs.chain.link/docs/chainlink-vrf */

pragma solidity ^0.5.0;

contract Randomizer is VRFConsumerBase{

  /*
  * In struct 'requests' we save the data we need to call Breeding ()
  * once the random number is returned by the oracle.
  *
  * In order to access request we use the bytes32 _requestId provided from getRandomNumber ()
  */

  /* Provided by the oracle (it's the public key against which randomness is generated) */
  bytes32 internal keyHash;

  /* The oracle's fee is set to 1 link  */
  uint256 internal fee;


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


  function getRandomNumber (
    address _requestor,
    uint256 _userProvidedSeed,
    uint256 _dadId,
    uint256 _mumId

  ) internal {

    uint256 seed = uint256(keccak256(abi.encode(_userProvidedSeed, blockhash(block.number)))); // Hash user seed and blockhash.

    bytes32 requestId = requestRandomness(keyHash, fee, seed);

    require (request[requestId].requestor == address(0),"Colliding requestId - failed"); // Not probable but not impossible.

    request[requestId].requestor = _requestor;
    request[requestId].dadId = _dadId;
    request[requestId].mumId = _mumId;

    emit RequestRandomness(requestId, keyHash, seed);
  }

}
