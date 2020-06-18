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
      displayKittyInfo(owner, kittyId, mumId, dadId, genes);
    })
    .on('error', console.error);
  });
 
  $("#createKitty").click(function(e) {
    /*
    *   When  you value are generated send me a uint32
    */

    //var dnaStr = $("#dna").val()

    // console.log(instance);

  //  KittyCore.createPromoKitty(dna, accounts(0));
    // instance.methods.createKitty(0, 0, 0, dnaStr, user).send({from: user, gas: 100000});
  })

  $("#generateKitty").click(generateKitty);

});



// take the Kitty dna, and update our image
function generateKitty() {

  dnaStr = String(Math.floor(Math.random()*1E16))
  console.log("dnaStr");
  console.log(dnaStr);

  let kittyDetails = {
    
    // first 2 digits make up the head. We have 7 possible heads, so % 7
    // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
    // image files named "head1.png" through "head7.png" we load based on
    // this number:
    bodyChoice: dnaStr.substring(0, 2) % 10 + 1,
    
    // 2nd 2 digits make up the eyes, 11 variations:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    
    // 3 variations of tail:
    tailChoice: dnaStr.substring(4, 6) % 3 + 1,

    // 6 variations of tongue:
    tongueChoice: dnaStr.substring(6, 8) % 6 + 1,
    
    // TODO ADD AN OTHER PART OF THE BODY:
    Choice: dnaStr.substring(8, 10) % 6 + 1,

    // last 6 digits control color. Updated using CSS filter: hue-rotate
    // which has 360 degrees:
    ColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    
    eyeColorChoice: parseInt(dnaStr.substring(12, 14) / 100 * 360),
    
    tailColorChoice: parseInt(dnaStr.substring(14, 16) / 100 * 360),
    
    ownerAddr: user,
    KittyDescription: "This is my first kitty",
  }
  generateCatCss(kittyDetails);
}

function generateCatCss(kittyDetails){

  console.log(kittyDetails);

// Set the kitty body Shape
  // default height 130 / width 110
  // default ear-right 6 / width 110

  let height = 130 + kittyDetails.bodyChoice * 4;
  let width = 110 + kittyDetails.bodyChoice;
  let earRight = 5 + kittyDetails.bodyChoice;

  $("#body").css('height', height);
  $("#body").css('width', width);
  $("#ear-right").css('margin-left', earRight);


// Set the kitty eyes

  //default height/width: 18px;
  //default border-radius: 50%;
  let eyeValue = 0;
  if (kittyDetails.eyeChoice > 5){
    eyeValue += kittyDetails.eyeChoice;
  } else {
    eyeValue -= kittyDetails.eyeChoice;
  }

  let eyesShape = 50 - kittyDetails.eyeChoice*2;
  let eyesSizePos = 30 - kittyDetails.eyeChoice;
  let eyesSize = eyeValue + 18;

  $(".eye").css('height', eyesSize);
  $(".eye").css('width', eyesSize);
  $(".eye").css('border-radius', eyesShape + "%");
  $("#eye").css('margin-top', eyesSizePos + "%");

// Special condition for big eyes and small body
  if (kittyDetails.bodyChoice <= 4 && kittyDetails.eyeChoice >= 6){
    $("#tummy").css('margin-top', "5%");
  } else {
    $("#tummy").css('margin-top', "20%");
  }

//  Set the kitty color
// First option
   var mycolor =  (parseInt("E9CBA7", 16) + kittyDetails.ColorChoice).toString(16) 
  $("#body").css('background-color', "#" + mycolor + "FF");
  $("#mask").css('background-color', "#" + mycolor + "FF");
  $(".ear").css('background-color', "#" + mycolor + "FF");

// Check with or without the filter but i think the filter is really cool
  $("#body").css('filter', "hue-rotate(" + kittyDetails.ColorChoice + "deg)");

// Set the kitty tail

  // Border 15px
  if (kittyDetails.tailChoice === 1){
    // $("#tail-end").css('border-radius', "1%");
    // $("#tail-end").css('margin-left', "125px");
    // $("#tail-end").css('height', "13px");
    // $("#tail-end").css('width', "13px");
    $("#tail").css('border-top-width', "10px");
    $("#tail").css('border-left-width', "10px");
    $("#tail").css('border-right-width', "10px");
  } else if (kittyDetails.tailChoice === 2){
    // $("#tail-end").css('border-radius', "50%");
    // $("#tail-end").css('margin-left', "130px");
    // $("#tail-end").css('height', "17px");
    // $("#tail-end").css('width', "17px");
    $("#tail").css('border-top-width', "15px");
    $("#tail").css('border-left-width', "15px");
    $("#tail").css('border-right-width', "15px");
  } else if (kittyDetails.tailChoice === 3){

    // Tail third option TODO

    // $("#tail-end").css('border-radius', "1%");
    // $("#tail-end").css('margin-left', "125px");
    // $("#tail-end").css('height', "13px");
    // $("#tail-end").css('width', "13px");
    $("#tail").css('border-top-width', "10px");
    $("#tail").css('border-left-width', "10px");
    $("#tail").css('border-right-width', "10px");
  }
// Set the kitty tongue
  // TODO
}

function displayKittyInfo(owner, kittyId, mumId, dadId, genes) {
  $("#kittyOnwer").text(owner);
  $("#kittyId").text(kittyId);
  $("#kittyMum").text(mumId);
  $("#kittyDad").text(dadId);
  $("#kittyGenes").text(genes);
}

function log(str){
  return  console.log(str)
}