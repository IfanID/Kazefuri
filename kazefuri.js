// ==MiruExtension==
// @name  Kazefuri
// @version v0.0.1
// @author IfanID
// @lang id-ID
// @icon https://kazefuri.id/favicon.ico
// @package kazefuri.metadata
// @type metadata
// @webSite https://kazefuri.id/
// ==/MiruExtension==

export default class extends Extension {
  async latest() {
    const res = await this.request("https://kazefuri.id/terbaru/");
    const bsxList = await this.querySelectorAll(
      res,
      "div.post-article > article"
    );
    const donghua = [];
    for (const element of bsxList) {
      const html = await element.content;
      let url2 = await this.getAttributeText(html, "div.thumb > a", "href");
      url2 = url2.replace('https://kazefuri.id', '');
      console.log(url2);
      const url = url2;
      const title = await this.querySelector(html, "h2 > a").text;
      const cover = await this.querySelector(
        html,
        ".attachment-post-thumbnail.size-post-thumbnail"
      ).getAttributeText("src");
      donghua.push({
        title: title.trim(),
        url,
        cover,
      });
    }
    return donghua;
  }

  async detail(url) {
    const res = await this.request(url);
    const title = await this.querySelector(res, 'h1.title').text
    const cover = await this.querySelector(res, 'img[itemprop="image"]').getAttributeText("src");
    const desc = "No Desc Avaliable";
    const episodes_360p = [];
    const episodes_480p = [];
    const episodes_720p = [];
    const epiList = await this.querySelectorAll(res, "div.list_eps_stream > li");

    for (const element of epiList) {
      const html = await element.content;
      const name = await this.querySelector(html, ".select-eps").text;
      const ep_url = await this.getAttributeText(html, ".select-eps", "data");
      const words = CryptoJS.enc.Base64.parse(ep_url);
      const textString = CryptoJS.enc.Utf8.stringify(words);
      const regex_360 = /"format":"360p","url":\["([^"]+)","([^"]+)"]/;
      const regex_480 = /"format":"480p","url":\["([^"]+)","([^"]+)"]/;
      const regex_720 = /"format":"720p","url":\["([^"]+)","([^"]+)"]/;
      const match_360 = textString.match(regex_360);
      const match_480 = textString.match(regex_480);
      const match_720 = textString.match(regex_720);
      const url = match_360? match_360[2] : "";
      const url_480 = match_480? match_480[2] : "";
      const url_720 = match_720? match_720[2] : "";


      episodes_360p.push({
        name: name.trim(),
        url,
      });
      episodes_480p.push({
        name: name.trim(),
        url: url_480,
      });
      episodes_720p.push({
        name: name.trim(),
        url: url_720,
      });
    }
    return{
      title: title.trim(),
      cover: cover,
      desc: desc,
      episodes:[{
        title: '360p',
        urls: episodes_360p.reverse()
      }, 
      {
        title: '480p',
        urls: episodes_480p.reverse()
      }, 
      {
        title: '720p',
        urls: episodes_720p.reverse()
      }]
    }
  }
        }
