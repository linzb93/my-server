const {Router} = require('express');
const axios = require('axios');
const path = require('path');
const {isEmpty} = require('lodash');
const fs = require('fs-extra');

const router = Router();
let agentConfig;

fs.readJSON('./agent.config.json', 'utf8')
.then(data => {
  agentConfig = data;
})
.catch(e => {
  console.log(e);
});

Router.all('/**', async (req, res) => {
  let resp;
  const projectId = req.originalUrl.split('/')[1];
  const real_path = req.originalUrl.split('/').slice(2).join('/');
  const match = agentConfig.filter(item => item.id === projectId);
  if (!match.length) {
    res.send({
      message: '无法跨域，请先配置白名单'
    });
    return;
  }
  if (path.extname(real_path)) {
    try {
      resp = await axios({
        method: 'get',
        url: `${match.prefix}${real_path}`,
        responseType: 'arraybuffer'
      });
    } catch(e) {
      if (e.response) {
        res.send(e.response.data);
      } else {
        res.send({
          message: '服务器故障'
        });
        console.log(e);
      }
      return;
    }
    res.set(resp.headers);
    res.send(resp.data);
  } else {
    const body = isEmpty(req.body) ? {} : {
      data: JSON.stringify(req.body)
    };
    try {
      resp = await axios({
        method: req.method,
        url: `${match.prefix}${real_path}`,
        headers: match.headers || {},
        ...body
      });
    } catch (e) {
      if (e.response) {
        res.send(e.response.data);
      } else {
        res.send({
          message: '服务器故障'
        });
        console.log(e);
      }
      return;
    }
    res.send(resp.data);
  }
})

module.exports = router;