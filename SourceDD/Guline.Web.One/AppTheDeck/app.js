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

app = angular.module('gulineWebApp', ['ezfb', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'ncy-angular-breadcrumb', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies']);
app.config(['$translateProvider', 'cfpLoadingBarProvider', "$sceProvider", '$locationProvider', 'ezfbProvider', function ($translateProvider, cfpLoadingBarProvider, $sceProvider, $locationProvider, ezfbProvider) {
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
                                     to = (current == slides.length - 1 ? 0 : current+1);
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
                        function ($scope, $rootScope, $state, $http, appconfig) {
                            $scope.CatName = $state.params.catName;
                            $scope.appconfig = appconfig.config;
                            $rootScope.$broadcast("change_nav", [true, "<strong class='nav-text'>" + $scope.CatName + " </strong>"]);
                            $scope.loadsize = function (value) {
                                var size = $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null && f.Color == value });
                                if (size.length > 0) {

                                    $scope.selectsize = size[0].Size;
                                }
                                else {
                                    $scope.selectsize = "";
                                }

                            }
                            //$scope.checkincart = function (id) {
                            //    var mobj = $(appconfig.ShoppingCart.List).filter(function () {
                            //        return this.ID == id;
                            //    }).first();


                            //    if (mobj != null && mobj.length > 0)
                            //        return true;
                            //    else
                            //        return false;
                            //}

                            getData();
                            function getData() {
                                $http.get("api/object/GetObjectContent?ID=" + $state.params.id)
                                   .success(function (response) {
                                       console.log(response);
                                       if (response.success) {

                                           $scope.obj = response.data;
                                           $scope.selectcolor = [];
                                           //$scope.obj.inCart = $scope.checkincart($scope.obj.ID);
                                           $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null }).forEach(function (f) {
                                               $scope.selectcolor.push(f.Color);
                                           });
                                           $state.current.data.title = $scope.obj.Title;
                                           $("html, body").animate({
                                               scrollTop: $('.breadcrumb').offset().top
                                           }, 1000);
                                           if (response.data.PageChildrens != null) {
                                               $scope.gupagination = { totalitems: response.data.PageChildrens.TotalItems, itemperpage: response.data.PageChildrens.ItemsPerPage, page: response.data.PageChildrens.CurrentPage, maxsize: 5 };
                                           }
                                       }
                                       else {
                                           $scope.msg = response.msg;
                                       }
                                   }).error(function (data, status, headers, config) {

                                       $scope.msg = data;

                                   });
                            }//end getdata
                        }]
                   }
               }
           })
        .state('main.home.giftcard', {
            url: "/menu",
            ncyBreadcrumb: {
                label: 'Gift Card', parent: null
            },
            data: { title: "Gift Card" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/giftcard/giftcard.html"
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig', "$timeout",
                     function ($scope, $rootScope, $state, $http, appconfig) {
                         $scope.CatName = $state.params.catName;
                         $scope.appconfig = appconfig.config;
                         $rootScope.$broadcast("change_nav", [true, "<strong class='nav-text'>" + $scope.CatName + " </strong>"]);
                         $scope.loadsize = function (value) {
                             var size = $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null && f.Color == value });
                             if (size.length > 0) {

                                 $scope.selectsize = size[0].Size;
                             }
                             else {
                                 $scope.selectsize = "";
                             }

                         }
                         //$scope.checkincart = function (id) {
                         //    var mobj = $(appconfig.ShoppingCart.List).filter(function () {
                         //        return this.ID == id;
                         //    }).first();


                         //    if (mobj != null && mobj.length > 0)
                         //        return true;
                         //    else
                         //        return false;
                         //}

                         getData();
                         function getData() {
                             $http.get("api/object/GetObjectContent?ID=" + $state.params.id)
                                .success(function (response) {
                                    console.log(response);
                                    if (response.success) {

                                        $scope.obj = response.data;
                                        $scope.selectcolor = [];
                                        //$scope.obj.inCart = $scope.checkincart($scope.obj.ID);
                                        $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null }).forEach(function (f) {
                                            $scope.selectcolor.push(f.Color);
                                        });
                                        $state.current.data.title = $scope.obj.Title;
                                        $("html, body").animate({
                                            scrollTop: $('.breadcrumb').offset().top
                                        }, 1000);
                                        if (response.data.PageChildrens != null) {
                                            $scope.gupagination = { totalitems: response.data.PageChildrens.TotalItems, itemperpage: response.data.PageChildrens.ItemsPerPage, page: response.data.PageChildrens.CurrentPage, maxsize: 5 };
                                        }
                                    }
                                    else {
                                        $scope.msg = response.msg;
                                    }
                                }).error(function (data, status, headers, config) {

                                    $scope.msg = data;

                                });
                         }//end getdata
                     }]
                }
            }
        })
    .state('main.home.event', {
        url: "/event",
        ncyBreadcrumb: {
            label: 'event', parent: null
        },
        data: { title: "event" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/event/event.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     $scope.accountactive = false;
                     $scope.infoactive = false;
                     $scope.orderactive = false;
                     $scope.changepass = false;
                     $scope.accountinfo = {
                         name: 'Jason Nguyen',
                         gender: "Nu",
                         email: 'jason.nguyen@gmail.com',
                         phone: '0982357990',
                         address: '123 Nguyen Cong Tru',
                         city: 'Ho Chi Minh',
                         district: '1'
                     };
                     $scope.acountorder = {
                         Count: 0
                     };
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
                 }]
            }
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
                 }]
            }
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
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
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
                controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                function ($scope, $state, $http, appconfig, $timeout) {
                    
                }]
            }
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
                controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", '$location',
                function ($scope, $state, $http, appconfig, $timeout, $location) {

                    var currentTab = "table";
                    if ($location.hash() != null && $location.hash() != '')
                        currentTab = $location.hash();
                    $scope.boatTypeList = [
                        "Cocktail Cruise",
                        "The Cu Chi Tunnel Experience",
                        "Corporate or private sunset cruise on a handcrafted dutch boat",
                        "Luxury yachtCorporate or private sunset cruise on a handcrafted dutch boat"
                    ]
                    $scope.boatType = "Cocktail Cruise";

                    $scope.getActiveTabClass = function (type) {
                        return currentTab == type ? "active" : "";
                    }

                    $scope.getActiveTabContent = function (type) {
                        return currentTab == type ? "in active" : "";
                    }

                    $scope.chooseBoatType = function (boatType) {
                        $scope.boatType = boatType;
                    }

                    $scope.activePanel = function (boatType) {
                        return $scope.boatType == boatType;
                    }
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
