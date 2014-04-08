var source = new EventSource("/a/"),
    startnum = 0,
    startlock = false;

source.onmessage = function (event) {
    'use strict';
    if (startlock === false) {
        startnum = event.data;
        startlock = true;
    }
    if ((event.data - startnum) !== 0) {
        $('#new').css({display: 'inline-block'});
    }
    $("div#new").text(event.data - startnum);
};