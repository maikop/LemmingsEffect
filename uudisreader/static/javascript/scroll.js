// IE8 fix indexOf funktsioonile
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

function getUrlData (searchfor) {
    searchfor = searchfor + '=';
    var pathname = window.location.search,
        start = pathname.indexOf(searchfor) + searchfor.length,
        end = (pathname.slice(start)).indexOf('&') + start
    if (end < start){
        end = pathname.length;
    }
    return (pathname.slice(start, end));

}
// Järgmine leht, mida laadida, kas url+1 või 2
// Kui order on NaN, siis võtab defaulti (pythonist)
// Loadlock ei luba topelt laadida
var page = (parseInt(getUrlData('page'))+1) || 2,
    order = getUrlData('order'),
    loadLock = false
$(window).scroll(function()
{
    if(($(window).scrollTop() == $(document).height() - $(window).height()) && loadLock == false)
    {
        loadLock = true;
        $('div#load').show();
        $.ajax({
        url: "empty/?page=" + page +'&order=' + order,
        success: function(html)
        {
            if(html)
            {
                $("#Headlines").append(html);
                $('div#load').hide();
                page = page + 1;
                loadLock = false;
            }else
            {
                $('div#load').html('<center>No more posts to show.</center>');
            }
        }
        });
    }
}); 
