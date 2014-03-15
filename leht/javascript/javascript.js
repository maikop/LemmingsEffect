//<![CDATA[
//Muutujad
var nameSpace = {
    lukus: false,
    korgus: 150,
    korda:1000,
    animatsioon:200,
    fixedheight:200,
    width: 600,
};
//Kui akna asukoht madalam kui kindel kõrgus, too logo nähtavale ja fikseeri header
//Kui akna asukoht kõrgem, peida logo ja lase header lahti
function movescroll() {
    if ($(window).scrollTop() >= nameSpace.korgus) {
        $("#HeaderMenu").css({
            position: 'fixed',
            left: '0px',
            top: '0px'
        });
        if (!nameSpace.lukus) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '90px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        }
    } else {
        $("#HeaderMenu").css({
            position: 'relative',
            left: '0px',
            top: nameSpace.korgus +"px"
        });
        if (!nameSpace.lukus) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '0px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        }
    }
}
$(function() {
	  var menubutton	= $('#headerMenuButton');
		menu		= $('#HeaderCenterMenu ul');
		menuHeight  = menu.height();
		var $body = $("body");
		//Paneb esimest korda menüü korguse paika
		if($(window).width() < nameSpace.width && menu.is(':hidden')) {
			$('#HeaderCenterMenu ul').css({height: $body.height()-nameSpace.fixedheight})
		}
		$(menubutton).on('click', function(e) {
			e.preventDefault();  
			menu.slideToggle();
		});

		$(window).resize(function(){  
			var w = $(window).width();
			var $body = $("body");
			var fixedHeight = $("#HeaderCenterMenu ul").height();
			if(w > nameSpace.width && menu.is(':hidden')) {  
				menu.removeAttr('style');  
			}
			$('#HeaderCenterMenu ul').css({height: $body.height()-nameSpace.fixedheight});
		});
});
$(window).load(function () {
    
    //Kui leht laetaks, uurib css-ist kõrguse järgi
    nameSpace.korgus = (parseInt($('#HeaderMenu').css('top')));
    movescroll();
    $(window).scroll(function () {
        movescroll();
    });
    //Kuni paremat lahendust pole, kontrollib kord sekundis scrollise asukohta
    //Juhuks, kui logo valesse asendisse kinni jääb
    window.setInterval(function () {
        movescroll();
    }, nameSpace.korda);


}); //]]>