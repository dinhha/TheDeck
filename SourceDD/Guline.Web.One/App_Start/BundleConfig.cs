using System.Web;
using System.Web.Optimization;

namespace Guline.Web.One
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Module/basejs.js").Include(
                  "~/Scripts/jquery-1.11.2.js",
                  "~/Scripts/jquery.mobile-1.4.5.min.js",
                  "~/Module/greensock/TweenMax.js",
                  "~/Module/jquerylazyload/jquery.lazyload.js",
                //"~/Scripts/bootstrap-slider.min.js"
                // "~/cadio/js/lib/binary.js",
                        "~/Module/ng/angular.min.js",
                         "~/Module/ng/angular-sanitize.min.js"
                        , "~/Module/ng-translate/angular-translate.min.js"
                         , "~/Module/ng-translate/angular-translate-loader-static-files.min.js"
                              , "~/Module/ng/angular-cookies.min.js"
                               , "~/Module/ng/angular-animate.min.js"
                               , "~/Module/ng-loadingbar/loading-bar.js"
                               , "~/Module/ui-breadcrumb/angular-breadcrumb.min.js"
                               , "~/Module/bootstrap/js/bootstrap.js"
                //, "~/Module/ngui-bootstrap/ngui-bootstrap-tpls.min.js",                         
                                , "~/Module/ngui-bootstrap/ui-bootstrap-tpls-0.13.0.js",
                               "~/Module/ngui-route/ngui-route.js",
                // "~/Module/momentjs/min/moment.min.js",
                // "~/Module/momentjs/min/locales.min.js",
                // "~/Module/humanize-duration/humanize-duration.js",
                               "~/Module/selected/js/selecter.js",
                               "~/Module/easyfb/easyfb.js",
                               //"~/Module/angular-google-maps/hvgMap.angular.ui.js",
                               "~/Module/slider/pgwslideshow.js",
                               "~/Module/textrator/jquery.textrotator.js",
                                "~/Module/greensock/plugins/ScrollToPlugin.js",
                                "~/Module/parallax/jquery.imageScroll.js",
                                "~/Module/alert/angular-flash.js",
                                "~/Module/bootstrap/js/moment.js",
                                "~/Module/bootstrap/js/collapse.js",
                                "~/Module/bootstrap/js/transition.js",
                                "~/Module/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
                                  "~/" + System.Configuration.ConfigurationManager.AppSettings["AppPath"] + "/app.js"
            ));
            bundles.Add(new StyleBundle("~/Module/basecss.css").Include(
                      "~/Module/bootstrap/css/bootstrap.css",
                      "~/" + System.Configuration.ConfigurationManager.AppSettings["AppPath"] + "/css/custom-bootstrap.css",
                      "~/" + System.Configuration.ConfigurationManager.AppSettings["AppPath"] + "/css/styles.css",
                      "~/Module/fa/css/font-awesome.min.css",
                        "~/Module/slider/pgwslideshow.css",
                        "~/Module/alert/angular-flash.css",
                        "~/Module/bootstrap-datetimepicker/bootstrap-datetimepicker.css",
                      "~/Module/ng-loadingbar/loading-bar.css"));


            bundles.Add(new ScriptBundle("~/Module/adminjs.js").Include(
                        "~/Scripts/jquery-1.8.2.min.js",
                        "~/Module/jqueryui/jquery-ui.min.js",


                        "~/Module/ng/angular.min.js",
                        "~/Module/jqueryui/sortable.js",
                        "~/Module/ng/angular-sanitize.min.js",
                        "~/Module/ng-translate/angular-translate.min.js",
                        "~/Module/ng-translate/angular-translate-loader-static-files.min.js",
                        "~/Module/ng/angular-cookies.min.js",
                        "~/Module/ng/angular-animate.min.js",
                        "~/Module/ng-loadingbar/loading-bar.js",
                        "~/Module/ui-breadcrumb/angular-breadcrumb.min.js",
                        "~/Module/ngui-bootstrap/ngui-bootstrap-tpls.min.js",
                        "~/Module/ngui-route/ngui-route.js",
                        "~/Module/ng-colorpicker/bootstrap-colorpicker-module.min.js",
                        "~/Module/jquery-cookie/jquery.cookie.min.js",
                          "~/Module/Checklistmodel/checklist-model.js",
                        "~/Module/ng-taginput/ng-tags-input.min.js",
                        "~/Module/ng-ckeditor/ng-ckeditor.min.js",
                        //"~/Module/hovercard/angular-hovercard.min.js",
                        "~/" + System.Configuration.ConfigurationManager.AppSettings["AdminAppPath"] + "/app.js"

            ));
            bundles.Add(new StyleBundle("~/Module/admincss.css").Include(
                      "~/Module/bootstrap/css/bootstrap.min.css",
                      "~/" + System.Configuration.ConfigurationManager.AppSettings["AdminAppPath"] + "/css/styles.css",
                      "~/Module/fa/css/font-awesome.min.css",
                      "~/Module/ng-colorpicker/colorpicker.min.css",
                      "~/Module/jqueryui/jquery-ui.min.css",
                      "~/Module/ng-taginput/ng-tags-input.min.css",
                      "~/Module/ng-taginput/ng-tags-input.bootstrap.min.css",
                      //"~/Module/hovercard/angular-hovercard.min.css",
                      "~/Module/ng-loadingbar/loading-bar.css"));
            BundleTable.EnableOptimizations = true;
        }
    }
}