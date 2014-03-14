//<![CDATA[
//Muutujad
var nameSpace = {
    lukus: false,
    korgus: 136,
    korda:1000,
    animatsioon:200
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
                left: '80px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        }
    } else {
        $("#HeaderMenu").css({
            position: 'absolute',
            left: '0px',
            top: nameSpace.korgus + 'px'
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