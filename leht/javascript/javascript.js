//<![CDATA[
//Muutujad
var nameSpace = {
    lukus: false, //Animatsiooni lukustus (muidu saadaks see pidevalt scrollides animatsioone ja lõhuks lehe)
    korgus: 150, //Headeri Menüü kõrgus (uurib automaatselt korrektse järgi)
    korda: 1000, //Ajavahemik, mille jooksul aktiveeritakse movescroll
    animatsioon: 200, //Animatsiooni kiirus
    fixedheight: 200, //Jätab menüü jaoks maksimaalselt nii palju vaba ruumi (enamvähem headeri kõrgus)
    minfixedheight: 50, //Menüü jätab pisut vaba ruumi
    width: 600, //Ekraanilaius, mille korral aktiveerib menüünupu
    minwidth: 354 //Ekraanilaius, millest väiksema puhul ei too logo nähtavale
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
        if (!nameSpace.lukus && $(window).width() > nameSpace.minwidth) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '90px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        } else if (!nameSpace.lukus && $(window).width() <= nameSpace.minwidth) { //Kui ekraan väiksem, peidab logo
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '0px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        }
    } else {
        $("#HeaderMenu").css({
            position: 'relative',
            left: '0px',
            top: nameSpace.korgus + "px"
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
$(function () {
    var menubutton = $('#headerMenuButton');
    menu = $('#HeaderCenterMenu ul');
    menuHeight = menu.height();
    var $body = $("body");
    var korgus = Math.max(nameSpace.fixedheight - $(window).scrollTop(), nameSpace.minfixedheight);
    //Paneb esimest korda menüü korguse paika
    if ($(window).width() < nameSpace.width && menu.is(':hidden')) {
        $('#HeaderCenterMenu ul').css({
            height: $("body").height() - korgus
        });
    }
    $(menubutton).on('click', function (e) {
        e.preventDefault();
        menu.slideToggle();
    });
    $(window).scroll(function () {
        korgus = Math.max(nameSpace.fixedheight - $(window).scrollTop(), nameSpace.minfixedheight);
        $('#HeaderCenterMenu ul').css({
            height: $("body").height() - korgus
        });
    });

    $(window).resize(function () {
        var w = $(window).width();
        var $body = $("body");
        var fixedHeight = $("#HeaderCenterMenu ul").height();
        if (w > nameSpace.width && menu.is(':hidden')) {
            menu.removeAttr('style');
        }
        $('#HeaderCenterMenu ul').css({
            height: $body.height() - korgus
        });
    });
});
$(window).load(function () {

    //Kui leht laetaks, uurib css-ist kõrguse järgi
    nameSpace.korgus = (parseInt($('#HeaderMenu').css('top'), 10));
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