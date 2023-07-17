const express = require('express');
const app = express();

const news = require('./routes/news');
app.use('/news', news);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), "번 포트에서 대기 중");
})

app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.ejs');
})