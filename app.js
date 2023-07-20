const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const news = require('./routes/news');
app.use('/news', news);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), "번 포트에서 대기 중");
});

app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.ejs');
});

app.get('/news', (req, res) => {
  try {
    res.status(200).json({
      status : "success",
      data : {
        yh : "연합뉴스",
        ytn : "YTN뉴스",
        joongang : "중앙일보",
        kbs : "KBS뉴스",
        sbs : "SBS뉴스",
        mbc : "MBC뉴스",
        jtbc : "JTBC뉴스"
      }
    });
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