var web3 = new Web3(Web3.givenProvider);
var instance;
var user;
var dnaStr = "457896541299";

var contract = "0x1E17a6e3eA50c28b620a1Bca61C8F991ed08F350";

$(document).ready(function() {
  window.ethereum.enable().then(function(accounts){
    instance = new web3.eth.Contract(abi, contract, {from: accounts[0]});
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
    var dnaStr = getDna();
    let res;
    try {
      res = instance.methods.createKittyGen0(dnaStr).send();
    } catch(err){
      console.log(err);
    }
}



async function getKitties(){  

//    instance.methods.getKittyByOwner(user);
  var arrayId;
  var kitty;
  try{    
    arrayId = await instance.methods.getKittyByOwner(contract).call();
  } catch(err){
    console.log(err);
  }
  for (i = 0; i < arrayId.length; i++){
    kitty = await instance.methods.getKitty(arrayId[i]).call();
    appendCat(kitty[0],i)
  }
  console.log(kitty);

}


function displayKittyInfo(owner, kittyId, mumId, dadId, genes) {
  $("kittytable").removeClass('hidden')
}
