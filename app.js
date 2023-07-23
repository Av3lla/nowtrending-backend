const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const axios = require("axios");
const cheerio = require("cheerio");

const news = require('./routes/news');
app.use('/news', news);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), "번 포트에서 대기 중");
});

app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.ejs');
});

app.get('/news', async (req, res) => {
  const yhLogo = await getLogo('yh');
  const ytnLogo = await getLogo('ytn');
  const joongangLogo = await getLogo('joongang');
  const kbsLogo = await getLogo('kbs');
  const sbsLogo = await getLogo('sbs');
  const mbcLogo = await getLogo('mbc');
  const jtbcLogo = await getLogo('jtbc');
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    res.status(200).json({
      status : "200",
      data : {
        연합뉴스 : {endpoint : "yh", logo : yhLogo},
        YTN뉴스 : {endpoint : "ytn", logo : ytnLogo},
        중앙일보 : {endpoint : "joongang", logo : joongangLogo},
        KBS뉴스 : {endpoint : "kbs", logo : kbsLogo},
        SBS뉴스 : {endpoint : "sbs", logo : sbsLogo},
        MBC뉴스 : {endpoint : "mbc", logo : mbcLogo},
        JTBC뉴스 : {endpoint : "jtbc", logo : jtbcLogo}
      }
    });
  } catch (error) {
    res.status(404).json({
      status : "404",
      message : {
        detail : "404 Not Found",
        error : error
      }
    })
  }
});

async function getLogo(press) {
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
  try {
    const url = `https://media.naver.com/press/${pressIndex}`
    const html = await axios.get(url);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const $ = cheerio.load(html.data);
    const selector = 'body > div.press_wrap > div > section.press_content > header > div.press_hd_main > div > div.press_hd_ci > a.press_hd_ci_image > img';
    const logo = $(selector).attr('src');
    return logo;
  } catch (error) {
    console.error(error);
    return error.response.status;
  }
}