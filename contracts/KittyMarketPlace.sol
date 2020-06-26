import "./KittyOwnership.sol";

pragma solidity ^0.5.0;

contract KittyMarketPlace is KittyOwnership {

  struct Offer {
      address payable seller;
      uint256 price;
  }

  mapping (uint256 => Offer) tokenIdToOffer;

  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  function getOffer(uint256 _tokenId)
      public
      view
      returns
  (
      address seller,
      uint256 price
  ) {
      Offer storage offer = tokenIdToOffer[_tokenId];
      return (
          offer.seller,
          offer.price
      );
  }

  function setOffer(uint256 _price, uint256 _tokenId)
    public
  {
    /*
    *   We give the contract the ability to transfer kitties
    *   As the kitties will be in the market place we need to be able to transfert them
    *   We are checking if the user is owning the kitty inside the approve function
    */
    tokenIdToOffer[_tokenId].seller = msg.sender;
    tokenIdToOffer[_tokenId].price = _price;
    emit MarketTransaction("Create offer", msg.sender, _tokenId);
  }

  function removeOffer(uint256 _tokenId)
    public
  {
    Offer memory offer = tokenIdToOffer[_tokenId];
    require(offer.seller == msg.sender, "You should own the kitty to be able to remove this offer");
    delete tokenIdToOffer[_tokenId];
    emit MarketTransaction("Remove offer", msg.sender, _tokenId);
  }

  function buyKitty(uint256 _tokenId)
    public
    payable
  {
    Offer memory offer = tokenIdToOffer[_tokenId];
    require(msg.value == offer.price, "The price is not correct");
    delete tokenIdToOffer[_tokenId];
    
    _approve(_tokenId, msg.sender);
    transferFrom(offer.seller, msg.sender, _tokenId);
    offer.seller.transfer(msg.value);
    emit MarketTransaction("Buy", msg.sender, _tokenId);
  }
 

}