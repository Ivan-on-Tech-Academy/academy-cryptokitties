
// File for fetching all the cats from smart contrat 
// into the catalogue

// when page load create the catalog
$(document).ready(function () {
    setTimeout(() => {
        getKitties()
    }, 1000)
});


//Append each Cat card as a catalog

function appendCat(dna, id) {
    //1 return DNA cat into readable string 
    var KittyDna = catDna(dna)
    //2 build the catBox into HTML
    catBox(id)
    //3 Render the cats CSS style depending on DNA string
    renderCat(KittyDna, id)
    $('#catDNA' + id).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>0</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna +`</h4></span>
    
    
    `)
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

//Cat HTML Div

function catBox(id) {

    var catDiv = `<div class="col-lg-4 pointer fit-content">
                 <div class="featureBox catDiv">
             
                 <div class="cat__ear">
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
                    </div>                  
                 </div>
                 <div class="dnaDiv" id="catDNA`+ id + `"></div>

                 <ul class="ml-5 cattributes">
                    <li><span id="eyeName`+id+`"></span> eyes</li>
                    <li><span id="decorationName`+id+`"></span> decoration</li>
                    <li><span id="animationName`+id+`"></span></li>
                  </ul>
                </div>`

    $('#catsDiv').append(catDiv)

}