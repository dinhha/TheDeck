function convertfromMSDate(dateStr) {
    var m, day;
    jsonDate = dateStr;
    var d = new Date(parseInt(jsonDate.substr(6)));
    m = d.getMonth() + 1;
    if (m < 10)
        m = '0' + m
    if (d.getDate() < 10)
        day = '0' + d.getDate()
    else
        day = d.getDate();
    return (day + '/' + m + '/' + d.getFullYear())
}
var decodeHtml = (function () {
    // Remove HTML Entities                                                             
    var element = document.createElement('div');

    function decode_HTML_entities(str) {

        if (str == null) {
            return "";
        }
        if (str && typeof str === 'string') {

            // Escape HTML before decoding for HTML Entities
            str = escape(str).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');

            element.innerHTML = str;
            if (element.innerText) {
                str = element.innerText;
                element.innerText = '';
            } else {
                // Firefox support
                str = element.textContent;
                element.textContent = '';
            }
        }

        return unescape(str);
    }
    return decode_HTML_entities;
})();
function url_friendly(alias) {
    if (alias == null || alias == "")
        return "";
    if (alias.length == 0)
        return "";
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, "");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi 

    str = str.replace(/\s+/g, '-').toLowerCase();
    return str;
}
app = angular.module('gulineWebApp', ['ezfb', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'ncy-angular-breadcrumb', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies', 'angular-flash.service', 'angular-flash.flash-alert-directive', ]);
app.config(['$translateProvider', 'cfpLoadingBarProvider', "$sceProvider", '$locationProvider', 'ezfbProvider', 'flashProvider',
    function ($translateProvider, cfpLoadingBarProvider, $sceProvider, $locationProvider, ezfbProvider, flashProvider) {
        //cfpLoadingBarProvider.includeSpinner = false;
        $translateProvider.useStaticFilesLoader({
            prefix: _gconfig.appPath + '/langs/',
            suffix: '.txt'
        });
        $translateProvider.preferredLanguage('vi-vn');
        $sceProvider.enabled(false);

        $locationProvider.html5Mode(true);
        ezfbProvider.setInitParams({
            appId: '269534733223147'
        });

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]);
app.factory('broadcastService', function ($rootScope) {

    var broadcastService = {};

    broadcastService.data = {};

    broadcastService.prepForBroadcast = function (data) {
        this.data = data;
        this.broadcastItem();
    };

    broadcastService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return broadcastService;
});

app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //$rootScope.msdate = convertfromMSDate;


    }
])
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
            ncyBreadcrumb: {
                label: 'SHOP'
            },
            views: {
                "gMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gMain.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.getMainClass = function () {
                             return $state.current.name == 'main.home.index' ? 'homepage' : "";
                         }
                     }]
                }//end vMain
            }
        })
        .state('main.home', {
            ncyBreadcrumb: {
                label: 'Trang chủ', parent: null
            },
            resolve: {
                appconfig: ['$http', function ($http) {
                    return $http({ method: 'GET', url: 'api/Object/getAppConfig' })
                      .then(function (res) {
                          var h = new Object();
                          var attrs = res.data.config.Attrs;
                          attrs.forEach(function (element, index, array) {
                              h[element.AttrName] = element.AttrValue;
                          });
                          return { config: h, menus: res.data.menus, province: res.data.ProvinceList };
                      });
                }]
            },
            views: {
                "vTop": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/vTop.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         //$scope.menu = appconfig.menus[0].Childrens;
                         $scope.appconfig = appconfig.config;
                         $scope.activeNav = function (state) {
                             return state == $state.current.name ? "active" : "";
                         }
                     }]

                },
                "vBottom": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gBottom.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         $scope.appconfig = appconfig.config;

                     }]
                },
                "vContent": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/home/index.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.goto = function (to) {
                             window.location.href = to;
                         }
                     }]
                }
            }
        }).state('main.home.index', {
            url: "{t:[/*]}",
            ncyBreadcrumb: {
                label: 'Home Page', parent: null
            },
            data: { title: "Trang chủ" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/home/home.html"
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig', '$timeout',
                     function ($scope, $rootScope, $state, $http, appconfig, $timeout) {
                         $scope.appconfig = appconfig.config;
                         $timeout(init);
                         function init() {
                             var tl = new TimelineMax();
                             tl.from('.vtop', .4, { x: 0, y: -80 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Power0.easeOut, delay: 1 });
                             tl.from('.gNav', .4, { x: 0, y: 150 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Power0.easeOut });
                             tl.from('.vtop .logo', .4, { autoAlpha: 0, y: -20, ease: Back.easeOut });
                             tl.from('.vtop .sub-nav', .4, { autoAlpha: 0, y: -20, ease: Back.easeOut });
                             tl.from('.vtop .main-nav', .4, { autoAlpha: 0, y: 0, ease: Back.easeOut });
                             tl.from('.home-content', .4, { autoAlpha: 0, y: 0, ease: Back.easeOut });


                             var delayTransition = 5000;
                             var slides = $('#slider_home img');
                             var slideBtns = $('#slider_button span');
                             var current = 0;
                             var interVal = setInterval(setSlide, delayTransition);

                             $('#slider_button span').on('click', function () {
                                 if (!$(this).is('.current')) {
                                     clearInterval(interVal);
                                     setSlide(slideBtns.index($(this)));
                                     interVal = setInterval(setSlide, delayTransition);
                                 }
                             });

                             function setSlide(to) {
                                 if (to == null) {
                                     to = (current == slides.length - 1 ? 0 : current + 1);
                                 }

                                 TweenMax.to(slides.eq(current), .4, { autoAlpha: 0, ease: Power0.easeOut });
                                 TweenMax.fromTo(slides.eq(to), .2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power1.easeIn });
                                 slideBtns.eq(current).removeClass('current');
                                 slideBtns.eq(to).addClass('current');
                                 current = to;
                             }
                         }
                     }]
                },
                "vNav": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gNav.html"
                  , controller: ['$scope', '$state', '$http', 'appconfig',
                    function ($scope, $state, $http, appconfig) {
                        $scope.appconfig = appconfig.config;
                        $('#quote_slider').textRotator({
                            random: true,
                            fadeIn: 1000,
                            fadeOut: 500,
                            duration: 5000,
                            debug: false

                        })
                    }]
                }
            }
        })
           .state('main.home.menu', {
               url: "/menu",
               ncyBreadcrumb: {
                   label: 'Menu', parent: null
               },
               data: { title: "Menu" },
               views: {
                   "homeMain": {
                       templateUrl: _gconfig.baseAppResouceUrl + "/views/menu/menu.html"
                      , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig', "$timeout",
                        function ($scope, $rootScope, $state, $http, appconfig, $timeout) {
                            var $window = $(window);
                            var scrollTime = 0.5;
                            var scrollDistance = 320;

                            var pWidth = 1550, pHeight = 400;
                            var rHeight = $window.width() / pWidth * pHeight;


                            $window.on('mousewheel DOMMouseScroll', function (event) {
                                event.preventDefault();
                                scrollTime = 0.5
                                var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
                                var scrollTop = $window.scrollTop();
                                var finalScroll = scrollTop - parseInt(delta * scrollDistance);
                                scrollTo(finalScroll);
                            });

                            $window.on('keydown', function (event) {
                                var scrollTop = $window.scrollTop(), delta = 0, scroll = false;
                                scrollTime = 0.5;
                                switch (event.keyCode) {
                                    case 33: //page up
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop -= document.documentElement.clientHeight;
                                        break;
                                    case 34: //page down
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop += document.documentElement.clientHeight;
                                        break;
                                    case 35: //end
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop = document.body.offsetHeight - document.documentElement.clientHeight;
                                        scrollTime = 2;
                                        break;
                                    case 36: //home
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop = 0;
                                        scrollTime = 2;
                                        break;
                                    case 38: //arrow up
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop -= scrollDistance;
                                        break;
                                    case 40: //arrow down
                                        event.preventDefault();
                                        scroll = true;
                                        scrollTop += scrollDistance;
                                        break;
                                    default:
                                }
                                if (scroll) scrollTo(scrollTop);
                            });

                            function scrollTo(position) {
                                TweenMax.to($window, scrollTime, {
                                    scrollTo: {
                                        y: position,
                                        autoKill: true
                                    },
                                    ease: Power1.easeOut,
                                    autoKill: true,
                                    overwrite: 1
                                });
                            }

                            $scope.menuGroups = [];
                            $scope.menuGroupDetails = {};

                            $http({
                                method: "post",
                                url: _gconfig.baseWebUrl + '/api/Object/ListMenuCategory',
                                data: { page: 1, pagesize: 100 },
                            }).success(function (res, status, headers, config) {
                                $scope.data = res.data.Items;

                                res.data.Items.forEach(function (menuCat, i) {
                                    $http({
                                        method: "post",
                                        url: _gconfig.baseWebUrl + '/api/Object/GetDetailMenu',
                                        data: { MenuCatID: menuCat.ID, page: 1, pagezise: 100 },
                                    }).success(function (data, status, headers, config) {
                                        data.data.Items.forEach(function (item, i) {
                                            data.data.Items[i].SubItems = JSON.parse(item.SubItems);
                                        });
                                        menuCat.menus = data.data.Items;
                                    });
                                    if ($scope.menuGroups.indexOf(menuCat.GroupName) == -1) {
                                        $scope.menuGroups.push(menuCat.GroupName);
                                        $scope.menuGroupDetails[menuCat.GroupName] = {
                                            name: menuCat.GroupName,
                                            cates: { left: [], right: [], center: [] }
                                        };
                                    }
                                    var position = (menuCat.Position || "").replace(/\s/g, '').toLowerCase();
                                    if (position == 'left' || position == 'right' || position == 'center')
                                        $scope.menuGroupDetails[menuCat.GroupName].cates[position].push(menuCat);
                                });

                                $timeout(function () {
                                    //$('.parallax-window').css('height', rHeight);
                                    //$('#parallax' + (i + 1)).parallax("0%", 0.1);

                                    //$('.img-holder').css('height', rHeight);
                                    $('.img-holder').imageScroll({
                                        container: $('.menu'),
                                        speed: .2,
                                        holderMinHeight: 200,
                                        holderMaxHeight: rHeight,
                                        mediaWidth: 1550,
                                        mediaHeight: 684,
                                    });
                                });
                            });

                            $scope.getIdMenu = function (menu) { return menu.toLowerCase().replace(/\s/, ''); };

                            var onShow = false;
                            $window.on('scroll', function () {
                                if ($window.scrollTop() > 150) {
                                    if (!onShow) {
                                        TweenMax.fromTo(".subMenu", 0.2, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power1.easeIn });
                                        onShow = true;
                                    }
                                }
                                else {
                                    TweenMax.to(".subMenu", 0.5, {
                                        autoAlpha: 0,
                                        ease: Power1.easeOut
                                    });
                                    onShow = false;
                                }
                            });

                            $('#page_wrapper').addClass('white');
                        }]
                   }
               },
               onExit: function () {
                   $('.parallax-mirror').remove();
                   $('.downloadourmenu').remove();
                   $('#page_wrapper').removeClass('white');
               }
           })
        .state('main.home.giftcard', {
            url: "/giftcard",
            ncyBreadcrumb: {
                label: 'Gift Card', parent: null
            },
            data: { title: "Gift Card" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/giftcard/giftcard.html"
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig', "$timeout",
                     function ($scope, $rootScope, $state, $http, appconfig) {


                     }]
                }
            }
        })
    .state('main.home.event', {
        url: "/event",
        ncyBreadcrumb: {
            label: 'Event', parent: null
        },
        data: { title: "Event" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/event/event.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     
                     $scope.activeli = function (value) {
                         if (value == 'account') {
                             $scope.accountactive = true;
                             $scope.infoactive = false;
                             $scope.orderactive = false;
                         }
                         else if (value == 'info') {
                             $scope.accountactive = false;
                             $scope.infoactive = true;
                             $scope.orderactive = false;
                         }

                         else {
                             $scope.accountactive = false;
                             $scope.infoactive = false;
                             $scope.orderactive = true;
                         }
                     }
                     $scope.show = false;
                     $scope.showdetail = function () {
                         if ($scope.show)
                             $scope.show = false;
                         else
                             $scope.show = true;
                     }
                     $('#page_wrapper').addClass('white');
                 }]
            }
        }, onExit: function () {
            $('#page_wrapper').removeClass('white');
        }

    })
    .state('main.home.ourstory', {
        url: "/our-story",
        ncyBreadcrumb: {
            label: 'Our Story', parent: null
        },
        data: { title: "Our Story" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/ourstory/about.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     $timeout(function () {
                         $('#quote_slider1').textRotator({
                             random: true,
                             fadeIn: 1000,
                             fadeOut: 500,
                             duration: 5000,
                             debug: false

                         });
                         $('#quote_slider2').textRotator({
                             random: true,
                             fadeIn: 1000,
                             fadeOut: 500,
                             duration: 5000,
                             debug: false
                         });
                     }, 100);
                     $('#page_wrapper').addClass('white');
                 }]
            }
        }, onExit: function () {
            $('#page_wrapper').removeClass('white');
        }
    })
    .state('main.home.contact', {
        url: "/contact",
        ncyBreadcrumb: {
            label: 'Contact Us', parent: null
        },
        data: { title: "Contact Us" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/contactus/contact.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", 'flash',
                 function ($scope, $state, $http, appconfig, $timeout, flash) {
                     $scope.contact = {};
                     $scope.sendcontact = function () {
                         $http.post(_gconfig.baseWebUrl + '/api/Object/AddContact', $scope.contact).
                             success(function (res, status, headers, config) {
                                 if (res.success) {
                                     flash.success = res.msg;
                                 }
                                 else {
                                     flash.error = res.msg;
                                 }
                             }).error(function (data, status, headers, config) {
                                 flash.error = res.msg;
                             });
                     }
                     $('#page_wrapper').addClass('white');
                 }]
            }
        }, onExit: function () {
            $('#page_wrapper').removeClass('white');
        }
    })
    .state('main.home.thedeckbar', {
        url: "/thedeckbar",
        ncyBreadcrumb: {
            label: 'The Deck Bar', parent: null
        },
        data: { title: "The Deck Bar" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/thedeckbar/thedeckbar.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
    .state('main.home.location', {
        url: "/location",
        ncyBreadcrumb: {
            label: 'Jobs', parent: null
        },
        data: { title: "Jobs" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/location/location.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     initialize();
                     function initialize() {
                         var myLatlng = new google.maps.LatLng(10.806738, 106.744477);
                         var mapOptions = {
                             center: myLatlng,
                             zoom: 17,
                             mapTypeId: google.maps.MapTypeId.HYBRID
                         };
                         var map = new google.maps.Map(document.getElementById('map-canvas'),
                             mapOptions);
                         var marker = new google.maps.Marker({
                             position: myLatlng,
                             animation: google.maps.Animation.DROP,
                             map: map,
                             title: 'The Deck Sai Gon'
                         });
                         var contentString = '<div id="content">' +
                                 '<img src="../../../Images/dedeckMap.png"></div>';

                         var infowindow = new google.maps.InfoWindow({
                             content: contentString
                         });
                         google.maps.event.addListener(infowindow, 'domready', function () {

                             // Reference to the DIV which receives the contents of the infowindow using jQuery
                             var iwOuter = $('.gm-style-iw');

                             /* The DIV we want to change is above the .gm-style-iw DIV.
                              * So, we use jQuery and create a iwBackground variable,
                              * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                              */
                             var iwBackground = iwOuter.prev();

                             // Remove the background shadow DIV
                             iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                             // Remove the white background DIV
                             iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
                             iwOuter.parent().parent().css({ top: '50px' });
                             iwBackground.children(':nth-child(3)').attr('style', function (i, s) { return s + 'display: none !important;' });

                         });
                         google.maps.event.addListener(marker, 'click', function () {

                             infowindow.open(map, marker);

                         });
                     }
                 }]
            }
        }
    })
    .state('main.home.photo', {
        url: '/photo',
        ncyBreadcrumb: {
            label: 'Photo gallery', parent: null
        },
        data: { title: "Photo gallery" },
        views: {
            'homeMain': {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/photo/photo.html",
                controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                function ($scope, $state, $http, appconfig, $timeout) {
                    $(document).ready(function () {
                        $('.pgwSlideshow').pgwSlideshow({
                            transitionEffect: 'fading',
                            autoSlide: true,
                            intervalDuration: 5000
                        });
                    });
                }]
            }
        }
    })
    .state('main.home.martini_club', {
        url: '/martini-club',
        ncyBreadcrumb: {
            label: 'Martini Club', parent: null
        },
        data: { title: "Martini Club" },
        views: {
            'homeMain': {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/martiniclub/martiniclub.html",
                controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", 'flash',
                function ($scope, $state, $http, appconfig, $timeout, flash) {
                    $scope.member = {};
                    $scope.save = function () {
                        $http.post(_gconfig.baseWebUrl + '/api/Object/AddMartini', $scope.member).
                            success(function (res, status, headers, config) {
                                if (res.success) {
                                    flash.success = res.msg;
                                }
                                else {
                                    flash.error = res.msg;
                                }
                            }).error(function (data, status, headers, config) {
                                flash.error = res.msg;
                            });
                    }
                    $('#page_wrapper').addClass('white');
                }]
            }
        }, onExit: function () {
            $('#page_wrapper').removeClass('white');
        }
    })

    .state('main.home.reservation', {
        url: '/reservation',
        ncyBreadcrumb: {
            label: 'Reservation', parent: null
        },
        data: { title: "Reservation" },
        views: {
            'homeMain': {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/reservation/reservation.html",
                controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", '$location', 'flash',
                function ($scope, $state, $http, appconfig, $timeout, $location, flash) {

                    var currentTab = "table";
                    if ($location.hash() != null && $location.hash() != '')
                        currentTab = $location.hash();

                    $scope.boatType = {
                        Cocktail: "Cocktail Cruise",
                        CuChi: "The Cu Chi Tunnel Experience",
                        Corp: "Corporate or private sunset cruise on a handcrafted dutch boat",
                        Luxury: "Luxury yachtCorporate or private sunset cruise on a handcrafted dutch boat"
                    };

                    $scope.boatTypeList = [
                        {
                            name: $scope.boatType.Cocktail,
                            des: ["Rose wine, Chef’s signature canapés, botted water, chilled towels, and service staff for groups of 8 or more."]
                        },
                        {
                            name: $scope.boatType.CuChi,
                            des: ["Pick up at Hotel in D1, light breakfast, picnic lunch, wine, soft drinks, bottled water, chilled towels, entrance fee, English speaking guide and service staff."]
                        },
                        {
                            name: $scope.boatType.Corp,
                            des: ["Rose wine, Chef’s signature canapés, bottled water, chilled towels and service staff for groups of 8 or more"]
                        },
                        {
                            name: $scope.boatType.Luxury,
                            des: ["Only yacht rental (excluding food, beverage, VAT, service), bespoke to your heart desire.", "+ Up to 12 people"]
                        }                        
                    ]

                    $scope.getActiveTabClass = function (type) {
                        return currentTab == type ? "active" : "";
                    }

                    $scope.getActiveTabContent = function (type) {
                        return currentTab == type ? "in active" : "";
                    }

                    $scope.chooseBoatType = function (boatType) {
                        $scope.boat.TypeBoat = boatType;
                    }

                    $scope.activePanel = function (boatType) {
                        return $scope.boat.TypeBoat == boatType;
                    }

                    var BoatTaxiPrice = {
                        'Oneway':{2: 2200000, add: 400000},
                        'Return': {2: 2750000, add: 550000}
                    }
                    
                    //Table booking
                    $scope.table = {
                        HasBoat: false,
                        Price: 0
                    };
                    $scope.hasBoat = 'false';
                    $scope.tablePrice = 0;
                    $scope.$watch('hasBoat', function (hasBoat) {
                        $scope.table.HasBoat = hasBoat == 'true';
                        if ($scope.table.HasBoat)
                            $scope.table.TypeBoat = 'Oneway';
                    });
                    $scope.$watch('table.NumberofBoat', function () { calcPrice('table'); });
                    $scope.$watch('table.TypeBoat', function () { calcPrice('table'); });

                    //Boat booking
                    $scope.boat = {
                        TypeBoat: $scope.boatType.Cocktail,
                        Price: 0
                    };
                    $scope.$watch('boat.NumofPeople', function () { calcPrice('boat'); });
                    $scope.$watch('boat.TypeBoat', function () { calcPrice('boat'); });
                    $scope.$watch('boat.Hours', function () { calcPrice('boat'); });
                    $scope.minPeo = 1;
                    $scope.maxPeo = 1000;

                    //Event booking
                    $scope.eventList = ['Company team building', 'End year party'];
                    $scope.event = {
                        TypeEvent: $scope.eventList[0]
                    };

                    //-----------
                    $scope.book = function (type) {
                        try{
                            switch (type) {
                                case 'table':
                                    $scope.table.Date = new Date($('#date').val());
                                    $scope.table.Time = $('#time').val();
                                
                                    $http.post(_gconfig.baseWebUrl + '/api/Object/TableBooking', $scope.table).
                                        success(function (res, status, headers, config) {
                                            if (res.success) {
                                                flash.success = res.msg;
                                            }
                                            else {
                                                flash.error = res.msg;
                                            }
                                        }).error(function (data, status, headers, config) {
                                            flash.error = res.msg;
                                        });
                                    break
                                case 'boat':
                                    $scope.boat.Date = new Date($('#perInfo_date').val());
                                    $scope.boat.Time = $('#perInfo_time').val();
                                    console.log($scope.boat);

                                    $http.post(_gconfig.baseWebUrl + '/api/Object/BoatBooking', $scope.boat).
                                        success(function (res, status, headers, config) {
                                            if (res.success) {
                                                flash.success = res.msg;
                                            }
                                            else {
                                                flash.error = res.msg;
                                            }
                                        }).error(function (data, status, headers, config) {
                                            flash.error = res.msg;
                                        });
                                    break
                                case 'event':
                                    $scope.event.EventDate = new Date($('#event_date').val());
                                    console.log($scope.event);

                                    $http.post(_gconfig.baseWebUrl + '/api/Object/EventBooking', $scope.event).
                                        success(function (res, status, headers, config) {
                                            if (res.success) {
                                                flash.success = res.msg;
                                            }
                                            else {
                                                flash.error = res.msg;
                                            }
                                        }).error(function (data, status, headers, config) {
                                            flash.error = res.msg;
                                        });
                                    break
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    
                    function calcPrice(type) {
                        switch (type) {
                            case 'table':
                                if ($scope.table.HasBoat && $scope.table.NumberofBoat != null && $scope.table.TypeBoat != null) {
                                    $scope.table.Price = ($scope.table.NumberofBoat > 0) * BoatTaxiPrice[$scope.table.TypeBoat][2];
                                    $scope.table.Price += ($scope.table.NumberofBoat > 2 ? $scope.table.NumberofBoat - 2 : 0) * BoatTaxiPrice[$scope.table.TypeBoat]['add'];
                                }
                                break;
                            case 'boat':
                                if ($scope.boat.NumofPeople != null && $scope.boat.TypeBoat != null) {
                                    switch ($scope.boat.TypeBoat) {
                                        case $scope.boatType.Cocktail:
                                            var price = {
                                                1: { '2': 4550000, 'add': 800000 },
                                                2: { '2': 6800000, 'add': 950000 }
                                            }
                                            if ($scope.boat.Hours != null) {
                                                var h = $scope.boat.Hours == 1 ? 1 : 2;
                                                $scope.boat.Price = ($scope.boat.NumofPeople > 0) * (price[h]['2'] * (Math.floor($scope.boat.Hours / h)) + price[1]['2'] * ($scope.boat.Hours % 2 && $scope.boat.Hours > 2));
                                                $scope.boat.Price += ($scope.boat.NumofPeople > 2 ? $scope.boat.NumofPeople - 2 : 0) * (price[h]['add'] * Math.floor($scope.boat.Hours / h) + price[1]['add'] * ($scope.boat.Hours % 2 && $scope.boat.Hours > 2));
                                            }
                                            $scope.minPeo = 1;
                                            $scope.maxPeo = 1000;
                                            break;
                                        case $scope.boatType.CuChi:
                                            var price = {
                                                '2': 13000000,
                                                'add': 2200000
                                            }
                                            $scope.boat.Price = ($scope.boat.NumofPeople > 0) * price['2'];
                                            $scope.boat.Price += ($scope.boat.NumofPeople > 2 ? $scope.boat.NumofPeople - 2 : 0) * price['add'];
                                            $scope.minPeo = 1;
                                            $scope.maxPeo = 1000;
                                            break;
                                        case $scope.boatType.Corp:
                                            var price = 1400000;
                                            if ($scope.boat.Hours != null)
                                                $scope.boat.Price = $scope.boat.NumofPeople * price * $scope.boat.Hours;
                                            $scope.minPeo = 12;
                                            $scope.maxPeo = 27;
                                            break;
                                        case $scope.boatType.Luxury:
                                            var price = 6900000;
                                            if ($scope.boat.Hours != null)
                                                $scope.boat.Price = price * $scope.boat.Hours;
                                            $scope.minPeo = 1;
                                            $scope.maxPeo = 12;
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                }]
            }
        }
    })

    .state('main.home.career', {
        url: "/career",
        ncyBreadcrumb: {
            label: 'Career', parent: null
        },
        data: { title: "Career" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/career/career.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
});
app.directive('gulzimage', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm) {
            //$elm.lazyload({
            //    effect: "fadeIn"
            //});
            //$elm.attr("src", $elm.attr("data-original"));
        }
    }
});
app.controller("rootController", ["$scope", "$state", "$translate", '$http', function ($scope, $state, $translate, $http) {

}]);

app.filter("range", function () {
    return function (input, total) {
        total = parseInt(total);
        input = [] || input;
        for (var i = 1; i <= total; i++) input.push(i);
        return input;
    }
})

app.directive('ngRequired', function () {
    return function (scope, element, attr) {
        var requireModel = attr.ngRequired;
        scope.$watch(requireModel, function (required) {
            if (required)
                element.attr('required', "");
            else
                element.removeAttr('required');
        });
    }
});
app.directive('formatNumber', function () {
    return function (scope, element, attr) {
        var numberModel = attr.formatNumber;
        scope.$watch(numberModel, function (number) {
            if (number != null)
                element.text((number + "").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    }
});
