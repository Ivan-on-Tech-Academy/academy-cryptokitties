
// File for fetching all the cats from smart contrat 
// into the catalogue

//Append each Cat card as a catalog
function appendCat(dna, id, gen) {
    //1 return DNA cat into readable string 
    var KittyDna = catDna(dna)
    //2 build the catBox into HTML
    catBox(id)
    //3 Render the cats CSS style depending on DNA string
    renderCat(KittyDna, id)
    $('#catview' + id).attr('onclick', 'go_to("catDetails.html?catId=' + id + '")')
    $('#catDNA' + id).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
}

//Append cat for breeding
function breedAppend(dna, id, gen, gender) {
    //1 return DNA cat into readable string 
    var KittyDna = catDna(dna)
    //2 build the catBox into HTML    
    catBox(id)
    //3 Render the cats CSS style depending on DNA string
    renderCat(KittyDna, id)
    $('#catDNA' + id).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)

    $('#catview' + id).attr('onclick', 'selectBreed("' + dna + '","' + id + '","' + gen + '","' + gender + '")')
}

function selectBreed(dna, id, gen, gender) {

    var KittyDna = catDna(dna)
    //2 build the singleCat into HTML
    var body = catBody(gender)
    var Cattributes = cattributes(gender)
    $('#cattributes' + gender).html(Cattributes)
    $('#' + gender).html(body)
    //3 Render the cats CSS style depending on DNA string
    renderCat(KittyDna, gender)
    $('#' + gender).addClass('breedSelect')
    $('#' + gender).attr('data-catid', id)
    $('#' + gender).attr('onclick', 'breedKitties("' + gender + '")')
    $('#catDNA' + gender).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4><input class="hidden" id="` + gender + `Id" type="number" value=` + id + `></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
    $('#catSelection').modal('hide')
    removeSelection(id, gender)
    readyToBredd()
}

function readyToBredd() {

    var mumId = $('#DameId').val()
    var dadId = $('#SireId').val()

    if (!empty(mumId) && !empty(dadId)) {
        $('#breed').css('filter', 'none')
        $('#breed').prop('disabled', false)
        $('#breed').attr('onclick', 'breed("' + dadId + '","' + mumId + '")')
        return true
    }
    $('#breed').prop('disabled', true)
    $('#breed').css('filter', ' grayscale()')
    return false
}

//If user select a selected cat from any gender, its remove it from the selection box
function removeSelection(id, gender) {

    var selectionDiv = `<div align="center">
                                <div class="egg">
                                </div>
                                <h4>Select a cat as `+ gender + `</h4>
                            </div>
                        </div>`

    if (gender == 'Dame') {
        var catData = $('#Sire').attr('data-catid')
        if (catData == id) {
            $('#Sire').attr('data-catid', 0)
            $('#Sire').attr('onclick', 'breedKitties(this.id)')
            $('#Sire').html(selectionDiv)
            $('#Sire').removeClass('breedSelect')
            $('#catDNASire').html('')
        }
    }
    if (gender == 'Sire') {
        var catData = $('#Dame').attr('data-catid')
        if (catData == id) {
            $('#Dame').attr('data-catid', 0)
            $('#Dame').attr('onclick', 'breedKitties(this.id)')
            $('#Dame').html(selectionDiv)
            $('#Dame').removeClass('breedSelect')
            $('#catDNADame').html('')
        }
    }
}

async function singleCat(dna, id, gen) {

    var KittyDna = catDna(dna)
    //2 build the singleCat into HTML
    var body = catBody(id)
    var Cattributes = cattributes(id)
    $('#cattributes').html(Cattributes)
    $('#singleCat').html(body)
    //3 Render the cats CSS style depending on DNA string
    renderCat(KittyDna, id)
    $('#catDNA').html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
    
    await catOffer(id)
}

// Checks the Kitty on market situation
async function catOffer(id) {

    //Checking if this cat is for Sale
    var offer = await checkOffer(id)
    var seller = offer.seller.toLocaleLowerCase()
    if (offer.onsale == true && seller != user) {
        $('#buyBox').removeClass('hidden')
        $('#priceBtn').html('<b>' + offer.price + ' ETH</b>')
        $('#buyBtn').attr('onclick', 'buyKitten(' + id + ',"' + offer.price + '")')
    }
    
    var ownership = await catOwnership(id)
    //If user owns the cat
    if (ownership == true) {        
        //If is not on sale
        if (offer.onsale == false) {
            $('#sellBox').removeClass('hidden')
            $('#sellBtn').attr('onclick', 'sellCat(' + id + ')')
        } else {
            $('#sellBox').removeClass('hidden')
            $('#cancelBox').removeClass('hidden')
            $('#cancelBtn').attr('onclick', 'deleteOffer(' + id + ')')
            $('#sellBtn').addClass('btn-success')
            $('#sellBtn').html('<b>For sale at:</b>')
            $('#catPrice').val(offer.price)
            $('#catPrice').prop('readonly', true)
        }
    }
}


//Apply cat CSS Styles from buidCat.js

function renderCat(dna, id) {

    headColor(dna.headcolor, id)
    mouthAndBelly(dna.mouthColor, id)
    eyeColor(dna.eyesColor, id)
    earsAndPaw(dna.earsColor, id)
    eyeVariation(dna.eyesShape, id)
    decorationVariation(dna.decorationPattern, id)
    midColor(dna.decorationMidcolor, id)
    SidesColor(dna.decorationSidescolor, id)
    animationVariation(dna.animation, id)
}

//Splitting the cat DNA to use it in render

function catDna(dnaStr) {


    var dna = {
        //Colors
        "headcolor": dnaStr.substring(0, 2),
        "mouthColor": dnaStr.substring(2, 4),
        "eyesColor": dnaStr.substring(4, 6),
        "earsColor": dnaStr.substring(6, 8),
        //Cattributes
        "eyesShape": dnaStr.substring(8, 9),
        "decorationPattern": dnaStr.substring(9, 10),
        "decorationMidcolor": dnaStr.substring(10, 12),
        "decorationSidescolor": dnaStr.substring(12, 14),
        "animation": dnaStr.substring(14, 15),
        "lastNum": dnaStr.substring(15, 16)
    }

    return dna
}

//Cat HTML Div for catalogue
function catBox(id) {

    var catDiv = `<div class="col-lg-4 pointer fit-content" id="catview` + id + `">
                 <div class="featureBox catDiv">
                 `+ catBody(id) + `                           
                 </div>
                 <div class="dnaDiv" id="catDNA`+ id + `"></div>
                 `+ cattributes(id) + `
                </div>`
    var catView = $('#catview' + id)
    if (!catView.length) {
        $('#catsDiv').append(catDiv)
    }
}


//Simple body of a cat
function catBody(id) {

    var single = `<div class="cat__ear">
                        <div id="leftEar`+ id + `" class="cat__ear--left">
                            <div class="cat__ear--left-inside"></div>
                        </div>
                        <div id="rightEar`+ id + `" class="cat__ear--right">
                            <div class="cat__ear--right-inside"></div>
                        </div>
                    </div>

                    <div id="head`+ id + `" class="cat__head">
                        <div id="midDot`+ id + `" class="cat__head-dots">
                            <div id="leftDot`+ id + `" class="cat__head-dots_first"></div>
                            <div id="rightDot`+ id + `" class="cat__head-dots_second"></div>
                        </div>
                        <div id="catEye`+ id + `" class="cat__eye">
                            <div class="cat__eye--left">
                                <span class="pupil-left"></span>
                            </div>
                            <div class="cat__eye--right">
                                <span class="pupil-right"></span>
                            </div>
                        </div>
                        <div class="cat__nose"></div>

                        <div id="mouth-contour`+ id + `" class="cat__mouth-contour"></div>
                        <div class="cat__mouth-left"></div>
                        <div class="cat__mouth-right"></div>

                        <div class="cat__whiskers-left"></div>
                        <div class="cat__whiskers-right"></div>
                    </div>

                    <div class="cat__body">

                        <div id="chest`+ id + `" class="cat__chest"></div>

                        <div id="chest_inner`+ id + `" class="cat__chest_inner"></div>


                        <div id="pawLeft`+ id + `" class="cat__paw-left"></div>
                        <div id="pawLeftInner`+ id + `" class="cat__paw-left_inner"></div>


                        <div id="pawRight`+ id + `" class="cat__paw-right"></div>
                        <div id="pawRightInner`+ id + `" class="cat__paw-right_inner"></div>


                        <div id="tail`+ id + `" class="cat__tail"></div>
                    </div>`
    return single
}

function cattributes(id) {

    var Cattributes = `<ul class="ml-5 cattributes">
                            <li><span id="eyeName`+ id + `"></span> eyes</li>
                            <li><span id="decorationName`+ id + `"></span> decoration</li>
                            <li><span id="animationName`+ id + `"></span></li>
                        </ul>`
    return Cattributes


}