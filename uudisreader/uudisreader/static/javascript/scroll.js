/*global window, $, jQuery, alert*/
/*global document: false */
function getUrlData(searchfor) {
    "use strict";
    searchfor = searchfor + '=';
    var pathname = window.location.search,
        start = pathname.indexOf(searchfor) + searchfor.length,
        end = (pathname.slice(start)).indexOf('&') + start;
    if (end < start) {
        end = pathname.length;
    }
    return (pathname.slice(start, end));
}
// Järgmine leht, mida laadida, kas url+1 või 2
// Kui order on NaN, siis võtab defaulti (pythonist)
// Loadlock ei luba topelt laadida
var page = (parseInt(getUrlData('page'), 10) + 1) || 2,
    order = getUrlData('order'),
    tab = getUrlData('tab'),
    kateg = getUrlData('kateg'),
    loadLock = false;
$(window).scroll(function () {
    "use strict";
    if (($(window).scrollTop() === $(document).height() - $(window).height()) && loadLock === false) {
        loadLock = true;
        $('div#load').show();
        $.ajax({
            url: "empty/?tab=" + tab + '&kateg=' + kateg + '&page=' + page + '&order=' + order,
            success: function (html) {
                if (html.length > 5) {
                    $("#Headlines").append(html);
                    $('div#load').hide();
                    page = page + 1;
                    loadLock = false;
                } else {
                    $('div#load').html('Lõpp');
                }
            }
        });
    }
});