var web3 = new Web3(Web3.givenProvider);
var instance;
var user;
var dnaStr = "457896541299";

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    instance = new web3.eth.Contract(abi, "0x58A21f7aA3D9D83D0BD8D4aDF589626D13b94b45", {from: accounts[0]});
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
      displayKittyInfo(owner, kittyId, mumId, dadId, genes);
    })
    .on('error', console.error);
  });
 
  $("#createKitty").click(function(e) {

    var dnaStr = getDna()

    instance.methods.createKittyGen0(dnaStr).send({from: user, gas: 100000});
  })

  $("#generateKitty").click(generateKitty);

});

// take the Kitty dna, and update our image
function generateKitty() {

  dnaStr = String(Math.floor(Math.random()*1E16))  

  let kittyDetails = {    
    ownerAddr: user,
    KittyDescription: "This is my first kitty",
  }
  generateCatCss(kittyDetails);
}

function displayKittyInfo(owner, kittyId, mumId, dadId, genes) {
  $("kittytable").removeClass('hidden')
  $("#kittyOnwer").text(owner);
  $("#kittyId").text(kittyId);
  $("#kittyMum").text(mumId);
  $("#kittyDad").text(dadId);
  $("#kittyGenes").text(genes);
}
