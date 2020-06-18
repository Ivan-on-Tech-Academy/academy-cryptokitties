
function catType1() {
    var firstColor = getColor()
    var secondColor = getColor()
    var thirdColor = getColor()
    var forthColor = getColor()
    setColors(firstColor, secondColor, thirdColor, forthColor)

}

function catType2() {
    var firstColor = getColor()
    var secondColor = getColor()
    var thirdColor = getColor()
    var forthColor = getColor()
    setColors(firstColor, secondColor, thirdColor, forthColor)
    //Decoration
    decorationColor(secondColor, thirdColor, forthColor)
}

function catType3() {
    var firstColor = getColor()
    var secondColor = getColor()
    var thirdColor = getColor()
    var forthColor = getColor()
    setColors(firstColor, secondColor, thirdColor, forthColor)
    //Decoration
    decorationColor2(secondColor, thirdColor, forthColor)
}
function catType4() {
    var firstColor = getColor()
    var secondColor = getColor()
    var thirdColor = getColor()
    var forthColor = getColor()
    setColors(firstColor, secondColor, thirdColor, forthColor)
    //Decoration
    decorationColor3(secondColor, thirdColor, forthColor)
}

//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

// *** Colors *** //

function setColors(firstColor, secondColor, thirdColor, forthColor) {
    //Head and chest
    headColor(firstColor)
    //Mouth belly
    mouthAndBelly(secondColor)
    //Eyes
    eyeColor(thirdColor)
    //Eyes shape
    eyeVariation()
    //Ears paws
    earsAndPaw(forthColor)
}

function headColor(color) {
    $('.cat__head, .cat__chest').css('background', '#' + color)
}

function mouthAndBelly(color) {
    $('.cat__mouth-contour, .cat__tail, .cat__chest_inner').css('background', '#' + color)
}

function eyeColor(color) {
    $('.cat__eye').find('span').css('background', '#' + color)
}

function earsAndPaw(color) {
    $('.cat__ear--left, .cat__ear--right, .cat__paw-left, .cat__paw-right,  .cat__paw-left_inner, .cat__paw-right_inner').css('background', '#' + color)
}

//3 dots single color
function decorationColor(color) {
    $('.cat__head-dots').css('background', '#' + color)
    $('.cat__head-dots_first').css('background', '#' + color)
    $('.cat__head-dots_second').css('background', '#' + color)
}

//Two colors
function decorationColor2(color, secondColor) {
    $('.cat__head-dots').css('background', '#' + color)
    $('.cat__head-dots_first').css('background', '#' + secondColor)
    $('.cat__head-dots_second').css('background', '#' + secondColor)
}

//3 colors
function decorationColor3(color, secondColor, thirdColor) {
    $('.cat__head-dots').css('background', '#' + color)
    $('.cat__head-dots_first').css('background', '#' + secondColor)
    $('.cat__head-dots_second').css('background', '#' + thirdColor)
}

//8 eye types
function eyeVariation(num) {

    if (!num) {
        var num = Math.floor(Math.random() * 7);
    }
    switch (num) {
        case 0:
            normalEyes()
            break
        case 1:
            normalEyes().then(() => {
                return eyesType1()
            })
            break
        case 2:
            normalEyes().then(() => {
                return eyesType2()
            })
            break
        case 3:
            normalEyes().then(() => {
                return eyesType3()
            })
            break
        case 4:
            normalEyes().then(() => {
                return eyesType4()
            })
            break
        case 5:
            normalEyes().then(() => {
                return eyesType5()
            })
            break
        case 6:
            normalEyes().then(() => {
                return eyesType6()
            })
            break
        case 7:
            normalEyes().then(() => {
                return eyesType7()
            })
            break
    }


}

// **   Eyes **  //

async function normalEyes() {
    await $('.cat__eye').find('span').css('border', 'none')
}

//top
function eyesType1() {
    $('.cat__eye').find('span').css('border-top', '15px solid')
}

//bottom
function eyesType2() {
    $('.cat__eye').find('span').css('border-bottom', '15px solid')
}

//top and bottom
function eyesType3() {
    $('.cat__eye').find('span').css({ 'border-top': '15px solid', 'border-bottom': '15px solid' })
}

//Right and left
function eyesType4() {
    $('.cat__eye').find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid' })
}

//Right left top
function eyesType5() {
    $('.cat__eye').find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid', 'border-top': '15px solid' })
}
//Right left botton
function eyesType6() {
    $('.cat__eye').find('span').css({ 'border-right': '15px solid', 'border-left': '15px solid', 'border-bottom': '15px solid' })
}
//Full shape
function eyesType7() {
    $('.cat__eye').find('span').css('border', '15px solid')
}

// **   Decoration **  //

// ** Angles ** //

function normaldecoration() {
    var dots = $('.cat__head-dots')    
    var dots2 = $('.cat__head-dots_first')    
    var dots3 = $('.cat__head-dots_second')    
    dots.attr('style','')
    dots2.attr('style','')
    dots3.attr('style','')
}

function noDecoration(){
    var dots = $('.cat__head-dots')    
    var dots2 = $('.cat__head-dots_first')    
    var dots3 = $('.cat__head-dots_second')    
    dots.removeClass('car__head-dots')
    dots2.removeClass('car__head-dots_first')
    dots3.removeClass('car__head-dots_second')
}

//inverted
function decoration1() {
    $('.cat__head-dots').css("transform", "rotate(180deg)")
    $('.cat__head-dots_first').css("transform", "rotate(0deg)")
    $('.cat__head-dots_second').css("transform", "rotate(0deg)")
}

//Twiss
function decoration2() {
    $('.cat__head-dots').css("transform", "rotate(180deg)")
    $('.cat__head-dots_first').css("transform", "rotate(180deg)")
    $('.cat__head-dots_second').css("transform", "rotate(180deg)")
}

// ** Parterns **//
// Unifrom partern
function decoration3() {
    normaldecoration()
    $('.cat__head-dots, .cat__head-dots_first, .cat__head-dots_second').css({ "height": "40px","width": "20px" })    
}





const closer = 4;
const further = -4;

document.addEventListener('mousemove', (e) => {
    let positionX = e.pageX;
    let positionY = e.pageY;

    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let moveX = (positionX - width / 2) / (width / 2) * closer;
    let moveY = (positionY - height / 2) / (height / 2) * closer;

    document.querySelector('.pupil-left').style.transform = 'translate(' + moveX + 'px,' + moveY + 'px)';
    document.querySelector('.pupil-right').style.transform = 'translate(' + moveX + 'px,' + moveY + 'px)';

    let cursor = document.querySelector('.cursor');
    cursor.setAttribute('style', 'top:' + positionY + 'px; left:' + positionX + 'px');
}, false);
