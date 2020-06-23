
// CSS properties to build each cat depending on the DNA


var colors = Object.values(allColors())

function headColor(code, id) {

    var color = colors[code]
    $('#head' + id + ', #chest' + id).css('background', '#' + color)
}

function mouthAndBelly(code, id) {
    var color = colors[code]
    $('#mouth-contour' + id + ', #tail' + id + ', #chest_inner' + id).css('background', '#' + color)
}

function eyeColor(code, id) {
    var color = colors[code]
    $('#catEye' + id).find('span').css('background', '#' + color)
}

function earsAndPaw(code, id) {
    var color = colors[code]
    $('#leftEar' + id + ', #rightEar' + id + ', #pawLeft' + id + ', #pawRight' + id + ', #pawRightInner' + id + ', #pawLeftInner' + id).css('background', '#' + color)

}

//Middle decoration color
function midColor(code, id) {
    var color = colors[code]
    $('#midDot' + id).css('background', '#' + color)
}

//Sides decoration color
function SidesColor(code, id) {
    var color = colors[code]
    $('#leftDot' + id).css('background', '#' + color)
    $('#rightDot' + id).css('background', '#' + color)
}

// Variation functions for range-bars

//8 eye types
function eyeVariation(num, id) {

    switch (num) {
        case "1":
            normalEyes(id)
            $('#eyeName' + id).html('Basic')
            break
        case "2":
            normalEyes(id)
            $('#eyeName' + id).html('Chill')
            return eyesType1(id)
            break
        case "3":
            normalEyes(id)
            $('#eyeName' + id).html('Cute')
            return eyesType2(id)
            break
        case "4":
            normalEyes(id)
            $('#eyeName' + id).html('Watching')
            return eyesType3(id)
            break
        case "5":
            normalEyes(id)
            $('#eyeName' + id).html('Night')
            return eyesType4(id)
            break
        case "6":
            normalEyes(id)
            $('#eyeName' + id).html('Wonder down')
            return eyesType5(id)
            break
        case "7":
            normalEyes(id)
            $('#eyeName' + id).html('Wonder up')
            return eyesType6(id)
            break
        case "8":
            normalEyes(id)
            $('#eyeName' + id).html('Circle')
            return eyesType7(id)
            break
    }
}


//8 decorations types
function decorationVariation(num, id) {

    switch (num) {
        case "1":
            $('#decorationName' + id).html('Basic')
            normaldecoration(id)
            break
        case "2":
            $('#decorationName' + id).html('Inverted')
            decorationType1(id)
            break
        case "3":
            $('#decorationName' + id).html('Twisted')
            decorationType2(id)
            break
        case "4":
            $('#decorationName' + id).html('Uniform')
            decorationType3(id)
            break
        case "5":
            $('#decorationName' + id).html('Uniform twist')
            decorationType4(id)
            break
        case "6":
            $('#decorationName' + id).html('Tribal')
            decorationType5(id)
            break
        case "7":
            $('#decorationName' + id).html('Propeller')
            decorationType6(id)
            break
        case "8":
            $('#decorationName' + id).html('Single')
            decorationType7(id)
            break
    }
}

//6 Animations 
function animationVariation(num, id) {

    switch (num) {
        case "1":
            $('#animationName' + id).html('Moving head')
            movingHead(id)
            break
        case "2":
            $('#animationName' + id).html('Moving tail')
            movingTail(id)
            break
        case "3":
            $('#animationName' + id).html('Moving ears')
            movingEars(id)
            break
        case "4":
            $('#animationName' + id).html('Move left Ear')
            leftEar(id)
            break
        case "5":
            $('#animationName' + id).html('Move right Ear')
            rightEar(id)
            break
        case "6":
            $('#animationName' + id).html('Attentive ears')
            attentiveCat(id)
            break
    }
}

// **   Eyes **  //

function normalEyes(id) {
    $('#catEye' + id).find('span').css('border', 'none')
}

//top
function eyesType1(id) {
    $('#catEye' + id).find('span').css('border-top', '15px solid')
}

//bottom
function eyesType2(id) {
    $('#catEye' + id).find('span').css('border-bottom', '15px solid')
}

//top and bottom
function eyesType3(id) {
    $('#catEye' + id).find('span').css({ 'border-top': '15px solid', 'border-bottom': '15px solid' })
}

//Right and left
function eyesType4(id) {
    $('#catEye' + id).find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid' })
}

//Right left top
function eyesType5(id) {
    $('#catEye' + id).find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid', 'border-top': '15px solid' })
}
//Right left botton
function eyesType6(id) {
    $('#catEye' + id).find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid', 'border-bottom': '15px solid' })
}
//Full shape
function eyesType7(id) {
    $('#catEye' + id).find('span').css('border', '15px solid')
}

// **   Decoration **  //

// ** Angles ** //

function normaldecoration(id) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('#midDot' + id).css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('#leftDot' + id).css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('#rightDot' + id).css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

//inverted
function decorationType1(id) {
    $('#midDot' + id).css("transform", "rotate(180deg)")
    $('#leftDot' + id).css("transform", "rotate(0deg)")
    $('#rightDot' + id).css("transform", "rotate(0deg)")
}

//Twiss
function decorationType2(id) {
    $('#midDot' + id).css("transform", "rotate(180deg)")
    $('#leftDot' + id).css("transform", "rotate(180deg)")
    $('#rightDot' + id).css("transform", "rotate(180deg)")


}

// ** Parterns **//
// Unifrom partern
function decorationType3(id) {
    $('.cat__head-dots, #leftDot,+id #rightDot' + id).css({ "height": "40px" })
}

//Combination of 3 and 4
function decorationType4(id) {
    $('.cat__head-dots, #leftDot,+id #rightDot' + id).css({ "height": "40px", "transform": "rotate(180deg)" })
}

//Tribal decoration
function decorationType5(id) {
    $('#midDot' + id).css({ "transform": "rotate(180deg)", "height": "50px", "border-radius": "50% 50% 50% 50%" })
    $('#leftDot' + id).css({ "transform": "rotate(35deg)", "height": "40px" })
    $('#rightDot' + id).css({ "transform": "rotate(-35deg)", "height": "40px" })
}

//Sides down
function decorationType6(id) {
    $('#midDot' + id).css({ "transform": "rotate(180deg)", "height": "50px", "border-radius": "50% 50% 50% 50%" })
    $('#leftDot' + id).css({ "transform": "rotate(135deg)", "height": "45px", "top": "-25px" })
    $('#rightDot' + id).css({ "transform": "rotate(-135deg)", "height": "45px", "top": "-25px" })

}

//Single dot decoration
function decorationType7(id) {
    var dots2 = $('#leftDot' + id)
    var dots3 = $('#rightDot' + id)
    dots2.css('height', '0px')
    dots3.css('height', '0px')

}

/** Animations **/

async function resetAnimation(id) {
    document.getElementById("head" + id).classList.remove("movingHead")
    document.getElementById("leftEar" + id).classList.remove("movingEarsLeft", "moving-Single-EarLeft", "attentionLeft")
    document.getElementById("rightEar" + id).classList.remove("movingEarsRight", "moving-Single-EarRight", "attentionRight")
    document.getElementById("tail" + id).classList.remove("movingTail")

}

function movingHead(id) {    
    $('#head' + id).addClass('movingHead')
    $('#leftEar' + id).addClass('movingEarsLeft')
    $('#rightEar' + id).addClass('movingEarsRight')
}

function movingTail(id) {    
    $('#tail' + id).addClass('movingTail')

}

//moving both ears
function movingEars(id) {    
    $('#leftEar' + id).addClass('movingEarsLeft')
    $('#rightEar' + id).addClass('movingEarsRight')

}

// Single Ears

function leftEar(id) {    
    $('#leftEar' + id).addClass('moving-Single-EarLeft')

}

function rightEar(id) {    
    $('#rightEar' + id).addClass('moving-Single-EarRight')

}

// Attentive Cat Ears animation

function attentiveCat(id) {    
    $('#leftEar' + id).addClass('attentionLeft')
    $('#rightEar' + id).addClass('attentionRight')

}


// Eyes of the car followign the cursor
const closer = 4;
const further = -4;

document.addEventListener('mousemove', (e) => {
    let positionX = e.pageX;
    let positionY = e.pageY;

    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let moveX = (positionX - width) / (width) * closer;
    let moveY = (positionY - height) / (height) * closer;

    $('.pupil-left').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)')
    $('.pupil-right').css('transform', 'translate(' + moveX + 'px,' + moveY + 'px)')

}, false);
