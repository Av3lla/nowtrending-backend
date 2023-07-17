const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/* GET home page. */
router.get('/:press', async (req, res) => {
  try {
    const press = req.params['press'];
    const response = await getNews(press);
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
          response : response
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

const getNews = async (press) => {
  try {
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
    const url = `https://media.naver.com/press/${pressIndex}/ranking?type=popular`;
    const newsHtml = await axios.get(url);

    const $ = cheerio.load(newsHtml.data);
    const selector = '#ct > div.press_ranking_home > div:nth-child(3) > ul > li';
    const liList = $(selector);

    let newsList = [];
    liList.map((i, element) => {
      newsList[i] = {
        rank: i + 1,
        title: $(element).find('a._es_pc_link div.list_content strong.list_title').text(),
        view: $(element).find('a._es_pc_link div.list_content span.list_view').text().replace(/\s/g, '').replace(/조회수/g, '')
      }
    });
    return newsList;
  } catch (error) {
    console.error(error);
    return error.response.status;
  }
};

/* async function test() {
  const temp = await getNews('ytn');
  console.log(temp);
}
test(); */

module.exports = router;