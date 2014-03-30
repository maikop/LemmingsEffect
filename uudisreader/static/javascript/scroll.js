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
            if(html.length > 5)
            {
                $("#Headlines").append(html);
                $('div#load').hide();
                page = page + 1;
                loadLock = false;
            }else
            {
                $('div#load').html('Lõpp');
            }
        }
        });
    }
}); 
