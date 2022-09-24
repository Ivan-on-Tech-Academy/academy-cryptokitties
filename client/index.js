var provider, signer, instance, user, address;
var dnaStr = "457896541299";
var contractAddress = "0xF1aE611fc478659D36188acEa42925426278a1Fd";

$(document).ready(async function () {
  // we need to verify if the browser have a wallet extension installed, Example: metamask
  if (window.ethereum) {
    // ethers provider
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    user = provider.getSigner();
    addrees = await user.getAddress();
    // ethers
    // A contract instance, It allows for easy interaction with the smart contract.
    instance = new ethers.Contract(contractAddress, abi, provider);
    // You need to connect to a Signer, so that you can pay to send state-changing transactions.
    signer = instance.connect(user);
    const testCall = await signer.owner();
    console.log('Ethereum Browser: Contract Owner', testCall);

  } else {
    console.log('NON-ETHEREUM BROWSER');
  }
});
//   /*     
//   EVENTS
const events = () => {
  //   *   Listen for the `Birth` event, and update the UI
  //   *   This event is generate in the KittyBase contract
  //   *   when the _createKitty internal method is called
  //   */
  instance.once('Birth', (owner, kittyId, mumId, dadId, genes) => {
    console.log('Birth', owner, kittyId, mumId, dadId, genes);
    alert_msg("owner:" + owner
      + " kittyId:" + kittyId
      + " mumId:" + mumId
      + " dadId:" + dadId
      + " genes:" + genes, 'success')

  });
  //   *   Listen for the `MarketTransaction` event, and update the UI
  instance.once('MarketTransaction', (TxType, tokenId) => {
    console.log('MarketTransaction', TxType, tokenId);
    var eventType = TxType.toString()
    if (eventType == "Buy") {
      alert_msg('Succesfully Kitty purchase! Now you own this Kitty with TokenId: ' + tokenId, 'success')
    }
    if (eventType == "Create offer") {
      alert_msg('Successfully Offer set for Kitty id: ' + tokenId, 'success')
      $('#cancelBox').removeClass('hidden')
      $('#cancelBtn').attr('onclick', 'deleteOffer(' + tokenId + ')')
      $('#sellBtn').attr('onclick', '')
      $('#sellBtn').addClass('btn-warning')
      $('#sellBtn').html('<b>For sale at:</b>')
      var price = $('#catPrice').val()
      $('#catPrice').val(price)
      $('#catPrice').prop('readonly', true)
    }
    if (eventType == "Remove offer") {
      alert_msg('Successfully Offer remove for Kitty id: ' + tokenId, 'success')
      $('#cancelBox').addClass('hidden')
      $('#cancelBtn').attr('onclick', '')
      $('#catPrice').val('')
      $('#catPrice').prop('readonly', false)
      $('#sellBtn').removeClass('btn-warning')
      $('#sellBtn').addClass('btn-success')
      $('#sellBtn').html('<b>Sell me</b>')
      $('#sellBtn').attr('onclick', 'sellCat(' + tokenId + ')')
    }

  });

}

async function createKitty() {
  var dnaStr = getDna();
  try {
    const tx = await signer.createKittyGen0(dnaStr);
    // wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('createKitty receipt', receipt)
  } catch (err) {
    console.log(err);
  }
}


async function checkOffer(id) {
  try {

    const req = await signer.getOffer(id);
    var price = res['price'];
    var seller = res['seller'];
    var onsale = false
    //If price more than 0 means that cat is for sale
    if (price > 0) {
      onsale = true
    }
    //Also might check that belong to someone
    price = ethers.utils.formatUnits(price, 'ether');
    var offer = { seller: seller, price: price, onsale: onsale }
    return offer

  } catch (err) {
    console.log(err);
    return
  }

}

// Get all the kitties from address
async function kittyByOwner(address) {
  try {
    const req = await signer.tokensOfOwner(address);
  } catch (err) {
    console.log(err);
  }
}

//Gen 0 cats for sale
async function contractCatalog() {
  var arrayId = await signer.getAllTokenOnSale();
  for (i = 0; i < arrayId.length; i++) {
    if (arrayId[i] != "0") {
      appendKitty(arrayId[i])
    }
  }
}

//Get kittues of a current address
async function myKitties() {  
  var arrayId = await signer.tokensOfOwner(addrees);
  
  for (i = 0; i < arrayId.length; i++) {
    appendKitty(arrayId[i])
  }
}

//Get kittues for breeding that are not selected
async function breedKitties(gender) {
  var arrayId = await signer.tokensOfOwner(addrees);
  for (i = 0; i < arrayId.length; i++) {
    appendBreed(arrayId[i], gender)
  }
}

// Checks that the user address is same as the cat owner address
//This is use for checking if user can sell this cat
async function catOwnership(id) {

  var address = await signer.ownerOf(id)

  if (address.toLowerCase() == user.toLowerCase()) {
    return true
  }
  return false

}



//Appending cats to breed selection
async function appendBreed(id, gender) {
  var kitty = await signer.getKitty(id)
  breedAppend(kitty[0], id, kitty['generation'], gender)
}

//Appending cats to breed selection
async function breed(dadId, mumId) {
  try {
    const tx = await signer.Breeding(dadId, mumId);
    const receipt = await tx.wait();
    console.log('breed receipt', receipt)
  } catch (err) {
    log(err)
  }
}

//Appending cats for catalog
async function appendKitty(id) {
  var kitty = await signer.getKitty(id)
  appendCat(kitty[0], id, kitty['generation'])
}


async function singleKitty() {
  var id = get_variables().catId
  var kitty = await signer.getKitty(id)
  singleCat(kitty[0], id, kitty['generation'])
}

async function deleteOffer(id) {
  try {
    const tx = await signer.methods.removeOffer(id);
    const receipt = await tx.wait();
    console.log('deleteOffer receipt', receipt)
  } catch (err) {
    console.log(err);
  }

}

async function sellCat(id) {
  var price = $('#catPrice').val()
  var amount = ethers.utils.formatUnits(price, "ether")
  try {
    const tx = await signer.setOffer(amount, id);
    const receipt = await tx.wait();
    console.log('sellCat receipt', receipt)
  } catch (err) {
    console.log(err);
  }
}

async function buyKitten(id, price) {
  var amount = ethers.utils.formatUnits(price, "ether")
  try {
    const tx = await signer.methods.buyKitty(id, [overrides.value = price]);
    const receipt = await tx.wait();
    console.log('buyKitten receipt', receipt)
  } catch (err) {
    console.log(err);
  }
}

async function totalCats() {
  var cats = await signer.totalSupply();
}

