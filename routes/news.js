const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/* GET home page. */
router.get('/:press', async (req, res) => {
  try {
    const press = req.params['press'];
    let pressIndex;
    switch (press) {
      case 'yh':
        pressIndex = '001';
        break;
      case 'ytn':
        pressIndex = '052';
        break;
      case 'joongang':
        pressIndex = '025';
        break;
      case 'kbs':
        pressIndex = '056';
        break;
      case 'sbs':
        pressIndex = '055';
        break;
      case 'mbc':
        pressIndex = '214';
        break;
      case 'jtbc':
        pressIndex = '437';
        break;
      default:
        pressIndex = '000';
        break;
    }
    const logo = await getLogo(pressIndex);
    const response = await getNews(pressIndex);
    if (response === 404) {
      res.status(400).json({
        status : "fail",
        message : "400 Bad Request"
      });
    } else {
      res.status(200).json({
        status : "success",
        data : {
          press : press,
          logo: logo,
          response : response,
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      status : "error",
      message : {
        detail : "404 Not Found",
        error : error
      }
    })
  }
});

const getLogo = async (pressIndex) => {
  try {
    const url = `https://media.naver.com/press/${pressIndex}`
    const html = await axios.get(url);

    const $ = cheerio.load(html.data);
    const selector = 'body > div.press_wrap > div > section.press_content > header > div.press_hd_main > div > div.press_hd_ci > a.press_hd_ci_image > img';
    const logo = $(selector).attr('src');
    return logo;
  } catch (error) {
    console.error(error);
    return error.response.status;
  }
}

const getNews = async (pressIndex) => {
  try {
    const url = `https://media.naver.com/press/${pressIndex}/ranking?type=popular`;
    const newsHtml = await axios.get(url);

    const $ = cheerio.load(newsHtml.data);
    const listSelector = '#ct > div.press_ranking_home > div:nth-child(3) > ul > li';
    const liList = $(listSelector);

    let articleList = [];
    liList.map((i, element) => {
      articleList[i] = {
        rank: i + 1,
        title: $(element).find('a._es_pc_link div.list_content strong.list_title').text(),
        view: $(element).find('a._es_pc_link div.list_content span.list_view').text().replace(/\s/g, '').replace(/조회수/g, ''),
        link: $(element).find('a._es_pc_link').attr('href'),
        thumbnail: $(element).find('a._es_pc_link div.list_img img').attr('src')
      }
    });
    return articleList;
  } catch (error) {
    console.error(error);
    return error.response.status;
  }
}

/* async function test() {
  const temp = await getNews('ytn');
  console.log(temp);
}
test(); */

module.exports = router;