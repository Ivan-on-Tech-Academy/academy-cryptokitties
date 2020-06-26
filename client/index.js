var web3 = new Web3(Web3.givenProvider);
var instance;
var user;
var dnaStr = "457896541299";

var contract = "0xd3add19ee7e5287148a5866784aE3C55bd4E375A";
var contractOwner = "0x2B522cABE9950D1153c26C1b399B293CaA99FcF9";

$(document).ready(function () {
  window.ethereum.enable().then(function (accounts) {
    instance = new web3.eth.Contract(abi, contract, { from: accounts[0] });
    user = accounts[0];
    /* 
    *   Listen for the `Birth` event, and update the UI
    *   This event is generate in the KittyBase contract
    *   when the _createKitty internal method is called
    */

    instance.events.Birth()
      .on('data', (event) => {
        console.log(event);
        let owner = event.returnValues.owner;
        let kittyId = event.returnValues.kittyId;
        let mumId = event.returnValues.mumId;
        let dadId = event.returnValues.dadId;
        let genes = event.returnValues.genes
        $("#kittyCreation").css("display", "block");
        $("#kittyCreation").text("owner:" + owner
          + " kittyId:" + kittyId
          + " mumId:" + mumId
          + " dadId:" + dadId
          + " genes:" + genes)
      })
      .on('error', console.error);
  });

});

function createKitty() {
  var dnaStr = getDna();
  let res;
  try {
    res = instance.methods.createKittyGen0(dnaStr).send();
  } catch (err) {
    console.log(err);
  }
}

async function checkOffer(id) {

  let res;
  try {

    res = await instance.methods.getOffer(id).call();
    var price = res['price'];
    var seller = res['seller'];
    var onsale = false
    //If price more than 0 means that cat is for sale
    if (price > 0) {
      onsale = true
    }
    //Also might check that belong to someone
    price = Web3.utils.fromWei(price, 'ether');
    var offer = { seller: seller, price: price, onsale: onsale }
    log(offer)
    return offer

  } catch (err) {
    console.log(err);
    return
  }


}


// Get all the kitties from address
async function kittyByOwner(address) {

  let res;
  try {
    res = await instance.methods.tokensOfOwner(address).call();
  } catch (err) {
    console.log(err);
  }
}

//Gen 0 cats for sale
async function contractCatalog() {
  var arrayId = await instance.methods.tokensOfOwner(contractOwner).call();
  for (i = 0; i < arrayId.length; i++) {
    appendKitty(arrayId[i])
  }
}

//Get kittues of a current address
async function myKitties() {
  var arrayId = await instance.methods.tokensOfOwner(user).call();
  for (i = 0; i < arrayId.length; i++) {
    appendKitty(arrayId[i])
  }
}

//Get kittues for breeding that are not selected
async function breedKitties(gender) {

  var arrayId = await instance.methods.tokensOfOwner(user).call();
  for (i = 0; i < arrayId.length; i++) {
    appendBreed(arrayId[i],gender)
  }
}

//Appending cats to breed selection
async function appendBreed(id,gender) {
  var kitty = await instance.methods.getKitty(id).call()  
  breedAppend(kitty[0], id, kitty['generation'],gender)
}

//Appending cats for catalog
async function appendKitty(id) {
  var kitty = await instance.methods.getKitty(id).call()  
  appendCat(kitty[0], id, kitty['generation'])
}


async function singleKitty() {
  var id = get_variables().catId
  var kitty = await instance.methods.getKitty(id).call()
  singleCat(kitty[0], id, kitty['generation'])
}

async function deleteOffer(id) {
  let res;
  try {
    res = await instance.methods.removeOffer(id).send();
  } catch (err) {
    console.log(err);
  }

}

async function buyKitten(id, price) {
  let res;
  var amount = web3.utils.toWei(price, "ether")
  try {
    res = await instance.methods.buyKitty(id).send({ value: amount });
    log(res)
  } catch (err) {
    console.log(err);
  }

}

async function totalCats() {
  var cats = await instance.methods.totalSupply().call();
  log(cats)
}

function displayKittyInfo(owner, kittyId, mumId, dadId, genes) {
  $("kittytable").removeClass('hidden')
}
