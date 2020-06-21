var web3 = new Web3(Web3.givenProvider);
var instance;
var user;
var dnaStr = "457896541299";

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    instance = new web3.eth.Contract(abi, "0x8c13AFB7815f10A8333955854E6ec7503eD841B7", {from: accounts[0]});
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
                            +" kittyId:" + kittyId
                            +" mumId:" + mumId
                            +" dadId:" + dadId
                            +" genes:" + genes)
    })
    .on('error', console.error);
  });

});

function createKitty(){  
    var dnaStr = getDna()
    instance.methods.createKittyGen0(dnaStr).send();
}

function displayKittyInfo(owner, kittyId, mumId, dadId, genes) {
  $("kittytable").removeClass('hidden')
  $("#kittyOnwer").text(owner);
  $("#kittyId").text(kittyId);
  $("#kittyMum").text(mumId);
  $("#kittyDad").text(dadId);
  $("#kittyGenes").text(genes);
}
