pragma solidity ^0.5.0;

import "./KittyCore.sol";
import "./utils/Ownable.sol";

/*
 * Market place to trade kitties (should **in theory** be used for any ERC721 token)
 * It needs an existing Kitty contract to interact with
 * Note: it does not inherit from the kitty contracts
 * Note: It takes ownership of the kitty for the duration that it is on the marketplace
 */
contract KittyMarketPlace is Ownable {
    KittyCore public kittyContract;

    struct Offer {
        address payable seller;
        uint256 price;
    }

    event OfferCreated(uint256 kittyId, uint256 price);
    event OfferCancelled(uint256 kittyId);
    event OfferSuccess(uint256 kittyId, uint256 price, address newOwner);

    mapping(uint256 => Offer) kittyIdToOffer;

    function setKittyContract(address _kittyContractAddress) public onlyOwner {
      kittyContract = KittyCore(_kittyContractAddress);
    }

    constructor(address _kittyContractAddress) public onlyOwner {
      setKittyContract(_kittyContractAddress);
    }

    function _ownsKitty(address _address, uint256 _kittyId)
        internal
        view
        returns (bool)
    {
        return (kittyContract.ownerOf(_kittyId) == _address);
    }

    function _addOffer(uint256 _kittyId, Offer memory _offer) internal {
        kittyIdToOffer[_kittyId] = _offer;

        emit OfferCreated(_kittyId, _offer.price);
    }

    function _cancelOffer(uint256 _kittyId, address _seller) internal {
        delete kittyIdToOffer[_kittyId];
        _returnKitty(_seller, _kittyId);

        emit OfferCancelled(_kittyId);
    }

    function _completeOffer(uint256 _kittyId, Offer memory offer) internal {
        // Important: delete the kitty from the mapping BEFORE paying out to prevent reentry attacks
        delete kittyIdToOffer[_kittyId];

        // Transfer the funds to the seller
        // TODO: make this logic pull instead of push?
        if (offer.price > 0) {
            offer.seller.transfer(offer.price);
        }

        // Transfer ownership of the kitty
        kittyContract.transfer(msg.sender, _kittyId);

        emit OfferSuccess(_kittyId, offer.price, msg.sender);
    }

    function _aquireKitty(address _owner, uint256 _kittyId) internal {
        kittyContract.transferFrom(_owner, address(this), _kittyId);
    }

    function _returnKitty(address _owner, uint256 _kittyId) internal {
        kittyContract.transfer(_owner, _kittyId);
    }

    /*
     * Create a new offer based for the given kittyId and price
     * If the kittyId already has an offer, it will be replaced
     */
    function createOffer(uint256 _kittyId, uint256 _price) public {
        require(
            _ownsKitty(msg.sender, _kittyId),
            "You are not the owner of that kitty"
        );

        _aquireKitty(msg.sender, _kittyId);
        Offer memory offer = Offer(msg.sender, _price);
        _addOffer(_kittyId, offer);
    }

    /*
     * Remove an existing offer
     */
    function removeOffer(uint256 _kittyId) public {
        Offer memory offer = kittyIdToOffer[_kittyId];
        require(
            offer.seller == msg.sender,
            "You are not the seller of that kitty"
        );

        _cancelOffer(_kittyId, offer.seller);
    }

    /*
     * Accept an offer and buy the kitty
     */
    function buyKitty(uint256 _kittyId) public payable {
        Offer memory offer = kittyIdToOffer[_kittyId];
        require(msg.value == offer.price, "The price is incorrect");

        _completeOffer(_kittyId, offer);
    }
}
