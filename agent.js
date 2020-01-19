const {Router} = require('express');
const axios = require('axios');
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

router.all('/**', async (req, res) => {
  let resp;
  const projectId = req.originalUrl.split('/')[2];
  const real_path = `/${req.originalUrl.split('/').slice(3).join('/')}`;
  const match = agentConfig.filter(item => item.id === projectId);
  if (!match.length) {
    res.send({
      message: '项目不存在'
    });
    return;
  }
  const body = isEmpty(req.body) ? {} : {
    data: JSON.stringify(req.body)
  };
  try {
    resp = await axios({
      method: req.method.toUpperCase(),
      url: `${match[0].prefix}${real_path}`,
      headers: {
        'Content-Type': 'application/json',
        ...match[0].headers ? match[0].headers.reduce((obj, item) => {
          if (req.get(item)) {
            obj[item] = req.get(item);
          }
          return obj;
        }, {}) : {}
      },
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
})

module.exports = router;