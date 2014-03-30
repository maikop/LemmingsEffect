/*Kuna kasutuses on JQuery, siis .each(index, element) juures on index kasutuses, mispÃ¤rast: 
 * jslint unparam: true
 * global JQuery $ ja window on mÃ¤Ã¤ratud */
/*global window, $, jQuery*/
/*jslint unparam: true*/
/*global document: false */

//IE8 indexOf fix
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
    };
}





//Muutujad
var nameSpace = {
    lukus: false,
    //Animatsiooni lukustus (muidu saadaks see pidevalt scrollides animatsioone ja lÃµhuks lehe)
    korgus: 150,
    //Headeri MenÃ¼Ã¼ kÃµrgus (uurib automaatselt korrektse jÃ¤rgi)
    korda: 5000,
    //Ajavahemik, mille jooksul aktiveeritakse movescroll
    animatsioon: 200,
    //Animatsiooni kiirus
    fixedheight: 200,
    //JÃ¤tab menÃ¼Ã¼ jaoks maksimaalselt nii palju vaba ruumi (enamvÃ¤hem headeri kÃµrgus)
    minfixedheight: 50,
    //MenÃ¼Ã¼ jÃ¤tab pisut vaba ruumi
    width: 585,
    //Ekraanilaius, mille korral aktiveerib menÃ¼Ã¼nupu
    minwidth: 360,
    //Ekraanilaius, millest vÃ¤iksema puhul ei too logo nÃ¤htavale
    HeaderMenuHeight: 40 //HeaderMenu height vÃ¤Ã¤rtus
};
//Kui akna asukoht madalam kui kindel kÃµrgus, too logo nÃ¤htavale ja fikseeri header
//Kui akna asukoht kÃµrgem, peida logo ja lase header lahti
function movescroll() {
    'use strict';
    if ($(window).scrollTop() >= nameSpace.korgus) {
        $("#HeaderMenu").css({
            position: 'fixed',
            left: '0px',
            top: '0px'
        });
        if (!nameSpace.lukus && $(window).innerWidth() > nameSpace.minwidth) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '90px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
            //Kui ekraan vÃ¤iksem, peidab logo
        } else if (!nameSpace.lukus && $(window).innerWidth() <= nameSpace.minwidth) {
            nameSpace.lukus = true;
            $("#HeaderCenterMenu").animate({
                left: '0px'
            }, nameSpace.animatsioon, function () {
                nameSpace.lukus = false;
            });
        }
    } else {
        $("#HeaderMenu").css({
            position: 'absolute',
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
    if (menu.is(':hidden')) {
        $('#HeaderCenterMenu ul').css({
            height: $("body").height() - korgus
        });
    }
    $(menubutton).on('click', function (e) {
        e.preventDefault();
        menu.slideToggle();
    });
    //Kontrollib menüü kõrgust
    function loadscroll () {
        korgus = Math.max(nameSpace.fixedheight - $(window).scrollTop(), nameSpace.minfixedheight);
        if ($(window).innerWidth() < nameSpace.width) {
            $('#HeaderCenterMenu ul').css({
                height: $("body").height() - korgus
            });
        } else {
            $('#HeaderCenterMenu ul').css({
                height: nameSpace.HeaderMenuHeight
            });
        }
    }
    $(window).load(function () {
        loadscroll();
    });
    $(window).scroll(function () {
        loadscroll();
    });
    function buttonshider() {
        if (menu.is(':hidden')) {
            menu.removeAttr('style');
        }
        if (menubutton.is(':visible')) {
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
    }
    buttonshider();
    $(window).resize(function () {
        buttonshider();
    });
});
$(window).load(function () {
    'use strict';
    //Nüüd css-ist saab JAVASCRIPTI olemasolu järgi asju kontrollida
    document.body.id = "JS";
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
        locationsave: 0,
        speed: "fast"
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
            menubutton = $('#headerMenuButton'),
            offset = tabBarWidth / 2,
            moveable = ul.find('.moveableContainer').first(),
            leftArrow = $("#LeftButton"),
            rightArrow = $("#RightButton");
        function tabsRealWidth() {
            var VtabsRealWidth = 0;
            //index kasutuses jquery each funktsioonis//
            ul.find('li').each(function (index, element) {
                VtabsRealWidth += $(element).width();
            });
            VtabsRealWidth += settings.buttonwidth;
            return VtabsRealWidth;
        }
        
        //Hash kõigile linkidele otsa!
        function hashLinks(){
        	for(var j = 0; j < $('.menu').length; j++){
		        var links = $('.menu')[j].getElementsByTagName('a');   
				for(var i = 0; i < links.length; i++) {
				    var link = links[i],
				    	end = (link.href.indexOf('#'));
				   	if (end < 0) {
				   		end = (link.href).length;
				   	}
				    link.href = link.href.slice(0, end) + location.hash;
	
				}
			}
		}
		hashLinks();        
        function getHashData (searchfor) {
            searchfor = searchfor + '=';
            var pathname = window.location.hash,
                start = pathname.indexOf(searchfor) + searchfor.length,
                end = (pathname.slice(start)).indexOf('#') + start;
            if (end < start){
                end = pathname.length;
            }
            return (pathname.slice(start, end));
        }
        settings.locationsave = getHashData ('tab');
        function setHashData (searchfor, value) {
            searchfor = searchfor + '=';
            var pathname = window.location.hash,
                start = pathname.indexOf(searchfor) + searchfor.length,
                end = (pathname.slice(start)).indexOf('#') + start;
            if (start < searchfor.length){
                window.location.hash = ((pathname + searchfor)+'');
                pathname = window.location.hash;
                start = pathname.length;
            }
            if (end < start){
                end = pathname.length;
            }
            location.hash = (pathname.slice(0, start) + value + pathname.slice(end, pathname.length));
            hashLinks();
        }
        $(".moveableContainer").css({width: tabsRealWidth() + 'px'});
        function hideWrapper() {
            if (menubutton.is(':hidden')) {
                if (toggleWrapInner) {
                    ul.wrapInner('<span class="fixedContainer"><div class="moveableContainer"  ></div></span>');
                    $('.fixedContainer').css({
                        width: parseInt($("#HeaderCenterMenu").css('width'), 10) - (2 * settings.buttonwidth) + 'px'
                    });
                    moveable = ul.find('.moveableContainer').first();
                    moveable.css({
                        left: settings.locationsave + 'px'
                    });
                    tabBarWidth = $('.fixedContainer').width();
                    offset = tabBarWidth / 2;
                    $('#LeftButton').css({
                        visibility: 'visible'
                    });
                    $('#RightButton').css({
                        visibility: 'visible'
                    });
                    toggleWrapInner = false;
                }
            } else {
                settings.locationsave = parseInt(moveable.css('left'), 10);
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
        function showButtons() {
            var currentPosition = parseInt(moveable.css('left'), 10);
            if (tabsRealWidth() <= parseInt($(".fixedContainer").css('width'), 10)) {
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
                }, settings.speed, function complete () {setHashData ('tab', parseInt(moveable.css('left'), 10));});
            } else {
                moveable.stop().animate({
                    left: currentPosition + offset + 'px'
                }, settings.speed, function complete () {setHashData ('tab', parseInt(moveable.css('left'), 10));});
            }
            if (tabsRealWidth() <= parseInt($(".fixedContainer").css('width'), 10)) {
                $('#RightButton').css({
                    visibility: 'hidden'
                });
                if (currentPosition >= 0) {
                    $('#LeftButton').css({
                        visibility: 'hidden'
                    });
                }
            } else {
                if (currentPosition >= 0 || currentPosition + offset >= 0) {
                    $('#LeftButton').css({
                        visibility: 'hidden'
                    });
                }
                $('#RightButton').css({
                    visibility: 'visible'
                });
            }
        });
        rightArrow.on('click', function (e) {
            e.preventDefault();
            var currentPosition = parseInt(moveable.css('left'), 10);
            if (tabBarWidth - currentPosition < tabsRealWidth()) {
                moveable.stop().animate({
                    left: currentPosition - offset + 'px'
                }, settings.speed, function complete () {setHashData ('tab', parseInt(moveable.css('left'), 10))});
            }
            if (tabsRealWidth() <= parseInt($(".fixedContainer").css('tab'), 10)) {
                $('#RightButton').css({
                    visibility: 'hidden'
                });
                if (currentPosition >= 0) {
                    $('#LeftButton').css({
                        visibility: 'hidden'
                    });
                }
            } else {
                if (tabBarWidth - (currentPosition - offset) >= tabsRealWidth()) {
                    $('#RightButton').css({
                        visibility: 'hidden'
                    });
                }
                $('#LeftButton').css({
                    visibility: 'visible'
                });
            }
        });
        function loadresize() {
            hideWrapper();
            headerCenterMenuWidth();
            $('.fixedContainer').css({
                width: parseInt($("#HeaderCenterMenu").css('width'), 10) - (2 * settings.buttonwidth) + 'px'
            });
            tabBarWidth = $('.fixedContainer').width();
            offset = tabBarWidth / 4;
            showButtons();
        }
        $(window).resize(function () {
            loadresize();
        });
        loadresize();
        return this;
    };
}(jQuery));
$(window).load(function () {
    'use strict';
    $("#HeaderCenterMenu").scrollabletab();
});