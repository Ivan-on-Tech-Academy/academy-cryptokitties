



/* HELPER FUNTIONS  */

function open_window(url) {
    window.open(url, '_blank')
}

function alert_msg(content, type, final = false) {
    var str = '';
    str += '<div class="alert alert-' + type + ' pr-2 fit-content" role="alert">' + content + '<button type="button" class="close ml-2" data-dismiss="alert" aria-label="Close"> <i class="far fa-times-circle"></i> </button></div>';
    if(final == true){
    $('.activeBox').append(str)
        return true
    }
    $('#message').html(str)    
    disable_alert()
}

function log(data){
    return console.log(data)
 } 

function disable_alert() {
    setTimeout(function () {
        $('.alert').fadeOut();
    }, 3000);
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

function empty(str) {
    return (!str || 0 === str.length);
}

