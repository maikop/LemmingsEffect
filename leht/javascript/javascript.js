//<![CDATA[ 
function movescroll(korgus){
	if ($(window).scrollTop() >= korgus)
    {
        $("#HeaderMenu").css({position:'fixed',left:'0px',top:'0px'});
    }
    else
    {
        $("#HeaderMenu").css({position:'absolute',left:'0px',top:korgus+'px'});
    }
}
$(window).load(function(){
	var korgus=170;
	movescroll(korgus);
$(window).scroll(function(){
    movescroll(korgus);
});
});//]]>  