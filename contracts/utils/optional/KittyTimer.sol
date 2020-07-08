/*
* Adding methods based on timestamp
*
* The idea is that, for each kitties born from a copule of cats, the waiting time
* between a pregnancy and a new one will increase.
*
* User can decrease this waiting time by paying.
*
* At kitty number 10 the user can decide himself the genes! Random will not be used.
* These special kitties will have generation == 65535 (max number held by uint16)
*
* Consider that each couple at 9th kitty is worth a lot more
*/

pragma solidity ^0.5.0;

contract KittyTimer {

  using SafeMath for uint256;

  // uint16 because of gen type in _createKitty()
  uint16 constant specialGen = 65535;


  /*
  * We are setting a waiting time for the first (1st) pregnancy
  */
  uint256 waitingTime;


  /*
  * Holds the number of days to wait before next pregnancy
  *
  * If linear we add 60 days to the current time
  *
  * If exponential we do the days to the power of kittyEachCouple[]
  */
  uint256 inc;


  /*
  * We are setting the increment of "waitingTime" type we want to use by using enum.
  *
  * There will be methods to handle both of them
  */

  enum INCREMENTYPE {
    Linear; // 0
    Exponential; // 1
  }

  INCREMENTYPE incrementType;


  /*
  * Because mumId and dadId are unique, we can hash them and get the total
  * number of cats for each copule of cats.
  *
  * This info is stored in the mapping below.
  *
  * Bytes32 = keccak256(abi.encodePacke(mum && dad IDs)) < referred as _coupleId
  * uint256 == number of kitties that this couple has.
  */
  mapping (bytes32 => uint256) internal kittyEachCouple;


  /*
  * Holds waiting time for each _coupleId
  */
  mapping (bytes32 => uint256) internal coupleWaitingTime;


  modifier isTime (bytes32 _coupleId) {
    require (now >= coupleWaitingTime[_coupleId], "Not yet time");
    _;
  }


  /*
  * Returns the increment type
  */
  function getIncrementType () internal view returns (INCREMENTYPE){
    return incrementType;
  }

  /*
  * We are setting the increment type for the Kitty contract.
  *
  * Linear increments == 0
  * Exponential == 1
  *
  * Not existing values are excluded automatically
  */
  function setIncrementType (INCREMENTYPE _new) public onlyOwner{
    incrementType = _new;
  }


  /*
  * The owner can set the waiting time for the 1st pregnancy.
  *
  * The waiting time is the calulate bases on the number of kitties for each _coupleId
  */
  function setWaitingTime (uint256 _newWaitingTime) public onlyOwner{
    waitingTime = _newWaitingTime;
  }


  /*
  * This MUST be called in breed ().
  */

  function newBorn (
    uint256 _mumId,
    uint256 _dadId
  ) internal returns (uint256) {

    bytes32 _coupleId = keccak256(
      abi.encodePacked(
        _mumId,_dadId
      )
    )

    uint256 incrementType = getIncrementType();

    bool result;
    if (incrementType == 0){
      result = linear(_coupleId);
    } else {
      result = exponential(_coupleId);
    }
    require (result == true, "Time increase failed");
  }


  // This increase the waiting time lineraly by adding the inc (in days)
  function linear (bytes32 _coupleId) private returns (uint256){
    coupleWaitingTime[_coupleId] = coupleWaitingTime[_coupleId] + inc.mul(1 days);
    return coupleWaitingTime[_coupleId];
  }


  function exponential (bytes32 _coupleId) private returns (uint256){
    uint256 newWaiting;
    newWaiting = inc ** kittyEachCouple[_coupleId];
    coupleWaitingTime[_coupleId] = coupleWaitingTime[_coupleId] + newWaiting.mul(1 days);
    return coupleWaitingTime[_coupleId];
  }


  function create10th (
    uint256 _mumId,
    uint256 _dadId,
    uint256 _genes
  ) public {

    bytes32 _coupleId = keccak256(
      abi.encodePacked(
        _mumId,_dadId
      )
    )

    require (kittyEachCouple[_coupleId] >= 10, "Not 10th kitty");

    kittyEachCouple[_coupleId] = 0; // After the special kitty we reset the counter

    _createKitty (
      _mumId,
      _dadId,
      specialGen,
      _genes,
      msg.sender
    )


  }





































}
