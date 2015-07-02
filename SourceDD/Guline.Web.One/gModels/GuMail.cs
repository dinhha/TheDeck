using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Postal;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace Guline.Web.One.gModels
{
    public class GuMail : Email
    {

        public GuMail()
            : base("MultiPart")
        {

        }
        public string To { get; set; }
        public string From { get; set; }
        public string Title { get; set; }
        public string ContentHtml { get; set; }
        public string ContentText { get; set; }
    }

    public static class GuExtHtml
    {
        public static string GetResourceCid(HtmlHelper html, string imagepath)
        {
            string original_text = Postal.HtmlExtensions.EmbedImage(html, imagepath, "").ToHtmlString();
            return Regex.Match(original_text, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
        }

        public static string BuildContent(HtmlHelper html, string Content)
        {

            var matches = Regex.Matches(Content, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                string url = match.Groups[1].Value;
                if (!url.Contains("cid"))
                {

                    string imagetagstr = Postal.HtmlExtensions.EmbedImage(html, url, "").ToHtmlString();
                    string newcid = Regex.Match(imagetagstr, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
                    Content = Content.Replace(url, newcid);
                }
            }

            matches = Regex.Matches(Content, @"background:url\('(?<bgpath>.*)'\)", RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                string url = match.Groups[1].Value;
                if (!url.Contains("cid"))
                {
                    string imagetagstr = Postal.HtmlExtensions.EmbedImage(html, url, "").ToHtmlString();
                    string newcid = Regex.Match(imagetagstr, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;

                    Content = Content.Replace(url, newcid);
                }
            }
            return Content;
        }

    }
}