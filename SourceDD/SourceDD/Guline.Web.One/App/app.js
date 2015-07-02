$(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
        $('.cartright').removeClass("hidden");
    } else {
        $('.cartright').addClass("hidden");
    }
});

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

            views: {
                "gMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gMain.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                     }]
                }//end vMain
            }
        })

        .state('main.home', {

            resolve: {
                appconfig: ['$http', function ($http) {
                    return $http({ method: 'GET', url: 'api/Object/getAppConfig' })
                      .then(function (res) {
                          var h = new Object();
                          var attrs = res.data.config.Attrs;
                          attrs.forEach(function (element, index, array) {
                              h[element.AttrName] = element.AttrValue;
                          });

                          return { config: h, menus: res.data.menus, ShoppingCart: res.data.ShoppingCart };
                      });
                }]
            },
            views: {
                "vTop": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/vTop.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         $scope.menu = appconfig.menus[0].Childrens;
                         $scope.appconfig = appconfig.config;
                         $scope.gototop = function () {
                             $("html, body").animate({ scrollTop: 0 }, 1000);
                         }
                         $scope.ShoppingCart = appconfig.ShoppingCart;
                     }]
                },

                "vNav": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gNav.html"
                  , controller: ['$scope', '$state', '$http', 'appconfig',
                    function ($scope, $state, $http, appconfig) {
                        $scope.appconfig = appconfig.config;
                        $scope.menu = appconfig.menus[1].Childrens;

                    }]
                },
                "vBottom": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gBottom.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         $scope.appconfig = appconfig.config;
                         $scope.menu2 = { name: appconfig.menus[2].Title, menus: appconfig.menus[2].Childrens };
                         $scope.menu3 = { name: appconfig.menus[3].Title, menus: appconfig.menus[3].Childrens };
                         $scope.menu4 = { name: appconfig.menus[4].Title, menus: appconfig.menus[4].Childrens };
                         $scope.menu5 = { name: appconfig.menus[5].Title, menus: appconfig.menus[5].Childrens };
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
        })
        .state('main.home.cart', {
            url: '/cart',
            data: { title: "Giỏ hàng" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gCart.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         //api
                         $http.get("api/object/GetCart")
                          .success(function (response) {
                        
                              if (response.success) {
                                  $scope.cart = response.data;
                              }
                              else {
                                  $scope.msg = response.msg;
                              }
                          }).error(function (data, status, headers, config) {
                              $scope.msg = data;
                          });
                         //
                     }]
                }//end vMain
            }
        })
        .state('main.home.contentshow', {
            url: "/{Slug}-i{ID}?page&pagesize",
            data: { title: "Nội dung" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/object/content.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig', '$location',
                     function ($scope, $state, $http, appconfig, $location) {
                         //$state.current.data.title = appconfig.config.pagetitle;
                         $scope.appconfig = appconfig.config;
                         $scope.urlFriendly = url_friendly;
                         $scope.getCurrentUrl = function () { return $location.path() };
                         $scope.isCollapsed = true;
                         $scope.gupagination = {};
                         $scope.checkincart = function (id) {
                             var mobj = $(appconfig.ShoppingCart.List).filter(function () {
                                 return this.ID == id;
                             }).first();


                             if (mobj != null && mobj.length > 0)
                                 return true;
                             else
                                 return false;
                         }

                         $scope.addcart = function (id, $event) {

                             var btn = $($event.currentTarget);
                             if (!btn.hasClass("disabled")) {
                                 btn.addClass("disabled");
                                 $http.get("api/Object/AddCart?ID=" + id)
                                 .success(function (response) {
                                     $(".cartcount").text(response.count);
                                     if (response.success) {
                                         btn.removeClass("btn-primary")
                                         btn.addClass("btn-success");
                                         $(".msgcart").text("Đã thêm vào giỏ hàng").removeClass("hidden").addClass("alert-success");
                                         $(".cartlabel").text("Đã thêm");
                                         appconfig.ShoppingCart.List.push({ ID: id });
                                     }
                                     else {
                                         $(".msgcart").text(response.msg).removeClass("hidden").addClass("alert-danger");
                                         $(".cartlabel").text("Đã thêm");
                                     }
                                 }).error(function (data, status, headers, config) {
                                     $scope.msg = data;
                                 });
                                 //
                             }
                         }
                         if ($state.params.page != undefined) {
                             $scope.gupagination.page = $state.params.page;
                         }
                         else {
                             $scope.gupagination.page = 1;
                         }
                         if ($state.params.pagesize != undefined) {
                             $scope.gupagination.itemperpage = $state.params.pagesize;
                         }
                         else {
                             $scope.gupagination.itemperpage = 12;
                         }

                         getData();

                         $scope.pageChanged = function () {
                             //console.log($scope.gupagination);                       
                             //$location.search({ page: $scope.gupagination.page, pagesize: $scope.gupagination.itemperpage });
                             getData();
                         };
                         function getData() {
                             $http.get("api/object/GetObjectContent?ID=" + $state.params.ID + "&cpageitem=" + $scope.gupagination.itemperpage + "&cpage=" + $scope.gupagination.page)
                               .success(function (response) {
                                   if (response.success) {
                                       $scope.obj = response.data;
                                       $scope.obj.inCart = $scope.checkincart($scope.obj.ID);

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
                }//end vMain
            }
        })    //objectshow
        .state('main.home.objectshow', {
            url: "/{Name}/view",
            data: { title: "Nội dung" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/object/typecontent.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         //$state.current.data.title = appconfig.config.pagetitle;
                         $scope.appconfig = appconfig.config;
                         //$scope.slideInterval = 5000;
                         $scope.urlFriendly = url_friendly;//GetViewObject
                         //
                         $http.get("api/object/GetViewObject?objectname=" + $state.params.Name)
                              .success(function (response) {
                                  if (response.success) {
                                      $scope.obj = response.data;
                                      $state.current.data.title = $scope.obj.gObjectDisplayName;
                                      $("html, body").animate({
                                          scrollTop: 0
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
                         //
                     }]
                }//end vMain
            }
        })
        .state('main.home.index', {
            url: "{t:[/*]}",
            ncyBreadcrumb: {
                label: 'Tài liệu CadCam', parent: null
            },
            data: { title: "Tài liệu CadCam" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/home/home.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         $state.current.data.title = appconfig.config.pagetitle;
                         $scope.appconfig = appconfig.config;
                         $scope.slideInterval = 5000;

                         $scope.checkincart = function (item) {

                             var mobj = $(appconfig.ShoppingCart.List).filter(function () {
                                 return this.ID == item.ID;
                             }).first();

                             if (mobj != null && mobj.length > 0) {
                                 item.inCart = true;
                                 return true;
                             }
                             else {
                                 item.inCart = false;
                                 return false;
                             }
                         }
                         $scope.addcart = function (id, $event) {

                             var btn = $("#" + $event.currentTarget.id);
                             console.log(btn);
                             if (!btn.hasClass("disabled")) {
                                 btn.addClass("disabled");
                                 $http.get("api/Object/AddCart?ID=" + id)
                                 .success(function (response) {
                                     $(".cartcount").text(response.count);
                                     if (response.success) {
                                         //$(".msgcart").text("Đã thêm vào giỏ hàng").removeClass("hidden").addClass("alert-success");
                                         appconfig.ShoppingCart.List.push({ ID: id });
                                         btn.html("<span class='cartlabel'><i class='fa fa-check font-success'></i>&nbsp;giỏ hàng</span>");
                                     }
                                     else {
                                         // $(".msgcart").text(response.msg).removeClass("hidden").addClass("alert-danger");
                                     }
                                 }).error(function (data, status, headers, config) {
                                     $scope.msg = data;
                                 });
                                 //
                             }
                         }
                         $http.get("api/object/GetListObjectData?objectname=slideshow")
                           .success(function (response) {
                               if (response.success) {
                                   $scope.myslide = response.data;
                               }
                               else {
                                   $scope.msg = response.msg;
                               }
                           }).error(function (data, status, headers, config) {

                               $scope.msg = data;

                           });

                         $http.get("api/object/GetListObjectData?objectname=specialpost")
                           .success(function (response) {
                               if (response.success) {
                                   $scope.myspecial = response.data;
                               }
                               else {
                                   $scope.msg = response.msg;
                               }
                           }).error(function (data, status, headers, config) {

                               $scope.msg = data;

                           });
                         //home panel
                         $http.get("api/object/GetPanelObjects?objects=book,video,soft,course")
                          .success(function (response) {
                              if (response.success) {
                                  $scope.panels = response.data;
                              }
                              else {
                                  $scope.msg = response.msg;
                              }
                          }).error(function (data, status, headers, config) {

                              $scope.msg = data;

                          });
                     }]
                }//end vMain
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