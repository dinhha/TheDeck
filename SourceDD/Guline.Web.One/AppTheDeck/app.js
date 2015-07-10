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
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig',
                     function ($scope, $rootScope, $state, $http, appconfig) {
                         $scope.appconfig = appconfig.config;
                         jQuery(function () {
                             init();
                         });
                         function init() {
                             $('.vtop').addClass('home');
                             var tl = new TimelineMax();
                             tl.from('.vtop', .4, { x: 0, y: -80 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Power0.easeOut, delay: 1 });
                             tl.from('.gNav', .4, { x: 0, y: 150 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Power0.easeOut });
                             tl.from('.vtop .logo', .4, { autoAlpha: 0, y: -20, ease: Back.easeOut });
                             tl.from('.vtop .sub-nav', .4, { autoAlpha: 0, y: -20, ease: Back.easeOut });
                             tl.from('.vtop .main-nav', .4, { autoAlpha: 0, y: 0, ease: Back.easeOut });
                             tl.from('.home-content', .4, { autoAlpha: 0, y: 0, ease: Back.easeOut });
                             //tl.staggerFromTo(".nav-footer .container", .6, { autoAlpha: 0, rotationY: 90 }, { autoAlpha: 1, rotationY: 0, force3D: true, ease: Power3.easeOut }, "-=.10")
                             //.from('.next.paging, .prev.paging', .1, { autoAlpha: 0, ease: Back.easeOut }, '-=2');
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
        .state('main.home.product', {
            url: "/:catName/:productID-:id",
            ncyBreadcrumb: {
                label: 'ProductPage', parent: null
            },
            data: { title: "Product" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/product/product.html"
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
    .state('main.home.account', {
        url: "/account",
        ncyBreadcrumb: {
            label: 'Account', parent: null
        },
        data: { title: "Account" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/account/youraccount.html"
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
                templateUrl: _gconfig.baseAppResouceUrl + "/views/about/about.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
    .state('main.home.payment', {
        url: "/paymentmethod",
        ncyBreadcrumb: {
            label: 'Payment Method', parent: null
        },
        data: { title: "Payment Method" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/payment/paymentmethod.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
    .state('main.home.job', {
        url: "/jobs",
        ncyBreadcrumb: {
            label: 'Jobs', parent: null
        },
        data: { title: "Jobs" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/job/job.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
     .state('main.home.bag', {
         url: "/bag",
         ncyBreadcrumb: {
             label: 'Your Bag', parent: null
         },
         data: { title: "Your Bag" },
         views: {
             "homeMain": {
                 templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/bag.html"
                , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                  function ($scope, $state, $http, appconfig, $timeout) {
                  }]
             }
         }
     })
           .state('main.home.checkout', {
               url: "/checkout",
               ncyBreadcrumb: {
                   label: 'Checkout Page', parent: null
               },
               data: { title: "Checkout" },
               views: {
                   "homeMain": {
                       templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/checkout.html"
                      , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                        function ($scope, $state, $http, appconfig, $timeout) {
                            $scope.provincelist = appconfig.province;
                            $scope.selectedProvince = {};
                            $scope.user = {
                                username: "",
                                password: ""
                            }
                            $scope.userRegister = {
                                FullName: "",
                                Password: "",
                                Gender: "Nam",
                                Email: "",
                                Phone: "",
                                Address: "",
                                Province: "",
                                District: ""
                            }
                            $scope.loaddistrict = function (selectedProvince) {
                                $scope.selectedProvince = selectedProvince;
                                getDistrict(selectedProvince.ID);
                            }
                            function getDistrict(value) {
                                $http.get("api/object/GetListDistrict?ID=" + value)
                                   .success(function (response) {
                                       $scope.districtlist = response.data;
                                   }).error(function (data, status, headers, config) {

                                       $scope.msg = data;

                                   });
                            }
                            $scope.checkasgest = function () {
                                $scope.isgest = true;
                                $scope.isregister = false;
                                $("html, body").animate({
                                    scrollTop: $('.info-box').offset().top
                                }, 1000);
                            }

                            $scope.register = function () {
                                $scope.isregister = true;
                                $scope.isgest = false;
                            }
                            $scope.registeraccount = function () {
                                $scope.userRegister.Province = $scope.selectedProvince.Province;
                                var data = $scope.userRegister;
                                $http({
                                    method: "post",
                                    url: '/api/User/Register',
                                    data: data,
                                }).success(function (data, status, headers, config) {
                                    alert('dang ki thanh cong');
                                    // this callback will be called asynchronously
                                    // when the response is available
                                }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                  });
                            }
                            $scope.logon = function () {
                                var data = $scope.user;
                                $http({
                                    method: "post",
                                    url: '/api/User/Login',
                                    data: data,
                                }).success(function (data, status, headers, config) {
                                    $scope.Username = data.FullName;
                                    // this callback will be called asynchronously
                                    // when the response is available
                                }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                  });
                            }
                        }]
                   }
               }
           })
            .state('main.home.review', {
                url: "/review",
                ncyBreadcrumb: {
                    label: 'Review Order', parent: null
                },
                data: { title: "Review Order" },
                views: {
                    "homeMain": {
                        templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/review.html"
                       , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                         function ($scope, $state, $http, appconfig, $timeout) {
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