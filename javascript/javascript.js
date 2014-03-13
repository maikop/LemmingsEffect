//<![CDATA[
var nameSpace = {
	lukus: false,
	korgus : 136
};
function movescroll(){
	var korgus = nameSpace.korgus;
	if ($(window).scrollTop() >= korgus){
		$("#HeaderMenu").css({position:'fixed',left:'0px',top:'0px'});
		if (!nameSpace.lukus){
			nameSpace.lukus=true;
			$("#HeaderCenterMenu").animate({left:'80px'},100,function(){nameSpace.lukus=false;});
		}
    }
    else
    {
        $("#HeaderMenu").css({position:'absolute',left:'0px',top:korgus+'px'});
	if (!nameSpace.lukus){
	      nameSpace.lukus=true;
	      $("#HeaderCenterMenu").animate({left:'0px'},100,function(){nameSpace.lukus=false;});
	}
    }
}
$(window).load(function(){
	nameSpace.korgus=(parseInt($('#HeaderMenu').css('top')));
	movescroll();
$(window).scroll(function(){
	movescroll();
});
});//]]>  