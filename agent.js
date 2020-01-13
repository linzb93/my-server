const express = require('express');
const axios = require('axios');
const cors = require('cors');
const {isEmpty} = require('lodash');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('/apiagent/**', async (req, res) => {
  let resp;
  let body = isEmpty(req.body) ? {} : {
    data: JSON.stringify(req.body)
  };
  try {
    resp = await axios({
      method: req.method,
      url: `https://www.sqgbpx.cn${req.originalUrl.replace('/apiagent', '')}`,
      headers: {
        'Content-Type': 'application/json'
      },
      ...body
    });
  } catch (e) {
    console.log(e.response.data);
    res.send({
      message: '服务器故障'
    });
    return;
  }
  res.send(resp.data)
})

app.listen(5000, () => {
  console.log('listen on  port 5000')
});