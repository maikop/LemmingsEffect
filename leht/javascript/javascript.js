/*Kuna kasutuses on JQuery, siis .each(index, element) juures on index kasutuses, mispärast: 
 * jslint unparam: true
 * global JQuery $ ja window on määratud */
/*jslint browser: true*/
/*global window, $, jQuery*/
/*jslint unparam: true*/
//<![CDATA[
//Muutujad
var nameSpace = {
    lukus: false,
    //Animatsiooni lukustus (muidu saadaks see pidevalt scrollides animatsioone ja lõhuks lehe)
    korgus: 150,
    //Headeri Menüü kõrgus (uurib automaatselt korrektse järgi)
    korda: 1000,
    //Ajavahemik, mille jooksul aktiveeritakse movescroll
    animatsioon: 200,
    //Animatsiooni kiirus
    fixedheight: 200,
    //Jätab menüü jaoks maksimaalselt nii palju vaba ruumi (enamvähem headeri kõrgus)
    minfixedheight: 50,
    //Menüü jätab pisut vaba ruumi
    width: 600,
    //Ekraanilaius, mille korral aktiveerib menüünupu
    minwidth: 354,
    //Ekraanilaius, millest väiksema puhul ei too logo nähtavale
    HeaderMenuHeight: 40 //HeaderMenu height väärtus
};
//Kui akna asukoht madalam kui kindel kõrgus, too logo nähtavale ja fikseeri header
//Kui akna asukoht kõrgem, peida logo ja lase header lahti
function movescroll() {
    'use strict';
    if ($(window).scrollTop() >= nameSpace.korgus) {
        $("#HeaderMenu").css({
            position: 'fixed',
            left: '0px',
            top: '0px'
        });
        if (!nameSpace.lukus && window.innerWidth > nameSpace.minwidth) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '90px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
            //Kui ekraan väiksem, peidab logo
        } else if (!nameSpace.lukus && window.innerWidth <= nameSpace.minwidth) {
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
    'use strict';
    var menubutton = $('#headerMenuButton'),
        menu = $('#HeaderCenterMenu ul'),
        korgus = Math.max(nameSpace.fixedheight - $(window).scrollTop(), nameSpace.minfixedheight);
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
    //Kontrollib menüü kõrgust
    $(window).scroll(function () {
        korgus = Math.max(nameSpace.fixedheight - $(window).scrollTop(), nameSpace.minfixedheight);
        if ($(window).width() < nameSpace.width) {
            $('#HeaderCenterMenu ul').css({
                height: $("body").height() - korgus
            });
        } else {
            $('#HeaderCenterMenu ul').css({
                height: nameSpace.HeaderMenuHeight
            });
        }
    });

    $(window).resize(function () {
        var w = window.innerWidth;
        if (w > nameSpace.width && menu.is(':hidden')) {
            menu.removeAttr('style');
        }
        if (w <= nameSpace.width) {
            $('#HeaderCenterMenu ul').css({
                height: $("body").height() - korgus
            });
            $('#LeftButton').css({
                display: 'none'
            });
            $('#RightButton').css({
                display: 'none'
            });
        } else {
            $('#HeaderCenterMenu ul').css({
                height: nameSpace.HeaderMenuHeight
            });
            $('#LeftButton').css({
                display: 'table'
            });
            $('#RightButton').css({
                display: 'table'
            });
        }
    });
});
$(window).load(function () {
    'use strict';
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

//Desktop Tabid Scrollivad
(function ($) {
    'use strict';
    var settings = {
        buttonwidth: 40,
        locationsave: 0 //Placeholder hetkel (peaks liigutama tabide fookust)
    };
    $.fn.scrollabletab = function () {
        settings.buttonwidth = (parseInt($('#LeftButton').css('width'), 10));
        function headerCenterMenuWidth() {
            var headerMenuWidth = (parseInt($('#HeaderMenu').css('width'), 10)),
                headerRightMenuWidth = (parseInt($('#HeaderRightMenu').css('width'), 10)),
                headerMovingLogoWidth = (parseInt($('#movingLogo').css('width'), 10));
            $('#HeaderCenterMenu').css({
                width: (headerMenuWidth - (headerMovingLogoWidth + headerRightMenuWidth + settings.buttonwidth)) + 'px'
            });
        }
        headerCenterMenuWidth();
        var toggleWrapInner = true,
            ul = this.children('ul').first(),
            tabBarWidth = $(this).width(),
            offset = tabBarWidth / 4,
            moveable = ul.find('.moveableContainer').first(),
            leftArrow = $("#LeftButton"),
            rightArrow = $("#RightButton");
        function tabsRealWidth() {
            var VtabsRealWidth = 0;
            //index kasutuses jquery each funktsioonis//
            ul.find('li').each(function (index, element) {
                VtabsRealWidth += $(element).width();
                VtabsRealWidth += parseInt($(element).css('margin-right'), 10);
            });
            //Vahel jääb muidu viimane tab osaliselt peitu
            VtabsRealWidth += (settings.buttonwidth) / 2;
            return VtabsRealWidth;
        }
        $(".moveableContainer").css({width: tabsRealWidth+'px'});
        function hideWrapper() {
            var w = window.innerWidth;
            if ((w > nameSpace.width)) {
                if (toggleWrapInner) {
                    ul.wrapInner('<span class="fixedContainer"><div class="moveableContainer"  ></div></span>');
                    $('.fixedContainer').css({
                        width: parseInt($("#HeaderCenterMenu").css('width'), 10) - (2 * settings.buttonwidth + 22) + 'px'
                    });
                    moveable = ul.find('.moveableContainer').first();
                    $('.moveableContainer').css({
                        left: settings.locationsave + 'px'
                    });
                    tabBarWidth = $('.fixedContainer').width();
                    offset = tabBarWidth / 4;
                    toggleWrapInner = false;
                }
            } else {
                //alert(parseInt(moveable.css('left'), 10));
                ul.find('.moveableContainer').children().unwrap();
                ul.find('.fixedContainer').children().unwrap();
                $('#LeftButton').css({
                    display: 'none'
                });
                $('#RightButton').css({
                    display: 'none'
                });
                toggleWrapInner = true;
            }
        }
        hideWrapper();

        function showButtons() {
            //moveable on defineeritud üleval//
            var currentPosition = parseInt(moveable.css('left'), 10);
            //alert(parseInt($("#HeaderCenterMenu").css('width'),10));
            if (tabsRealWidth <= parseInt($("#HeaderCenterMenu").css('width'), 10)) {
                $('#RightButton').css({
                    visibility: 'hidden'
                });
                if (currentPosition >= 0) {
                    $('#LeftButton').css({
                        visibility: 'hidden'
                    });
                }
            } else {
                if (currentPosition === 0) {
                    $('#LeftButton').css({
                        visibility: 'hidden'
                    });
                } else {
                    $('#LeftButton').css({
                        visibility: 'visible'
                    });
                }
                if ((tabBarWidth - currentPosition) >= tabsRealWidth()) {
                    $('#RightButton').css({
                        visibility: 'hidden'
                    });
                } else {
                    $('#RightButton').css({
                        visibility: 'visible'
                    });
                }
            }
        }
        leftArrow.on('click', function (e) {
            e.preventDefault();
            var currentPosition = parseInt(moveable.css('left'), 10);
            if (currentPosition + offset >= 0) {
                moveable.stop().animate({
                    left: '0'
                }, 'slow');
            } else {
                moveable.stop().animate({
                    left: currentPosition + offset + 'px'
                }, 'slow');
            }
            if (currentPosition >= 0 || currentPosition + offset >= 0) {
                $('#LeftButton').css({
                    visibility: 'hidden'
                });
            }
            $('#RightButton').css({
                visibility: 'visible'
            });
        });
        rightArrow.on('click', function (e) {
            e.preventDefault();
            var currentPosition = parseInt(moveable.css('left'), 10);
            if (tabBarWidth - currentPosition < tabsRealWidth()) {
                moveable.stop().animate({
                    left: currentPosition - offset + 'px'
                }, 'slow');
            }
            if (tabBarWidth - (currentPosition - offset) >= tabsRealWidth()) {
                $('#RightButton').css({
                    visibility: 'hidden'
                });
            }
            $('#LeftButton').css({
                visibility: 'visible'
            });
        });
        $(window).resize(function () {
            hideWrapper();
            showButtons();
            headerCenterMenuWidth();
            $('.fixedContainer').css({
                width: parseInt($("#HeaderCenterMenu").css('width'), 10) - (2 * settings.buttonwidth + 22) + 'px'
            });
            tabBarWidth = $('.fixedContainer').width();
            offset = tabBarWidth / 4;
            showButtons();
            headerCenterMenuWidth();
        });
        showButtons();
        return this;
    }; // end of functions
}(jQuery));
$(function () {
    'use strict';
    $("#HeaderCenterMenu").scrollabletab();
});