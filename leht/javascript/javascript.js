//<![CDATA[ 
$(window).load(function(){
$(window).scroll(function(){
    var korgus=170;
    if ($(window).scrollTop() >= korgus)
    {
        $("#HeaderMenu").css({position:'fixed',left:'0px',top:'0px'});
    }
    else
    {
        $("#HeaderMenu").css({position:'absolute',left:'0px',top:korgus+'px'});
    }
});
});//]]>  