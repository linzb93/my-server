const axios = require('axios');
const {Router} = require('express');
const {v4: uuid} = require('uuid');
const dayjs = require('dayjs');
const pMap = require('p-map');
const fs = require('fs-extra');
const multer = require('multer');
const {saveData, getData, saveFile,deleteData} = require('../../service/db');

const router = Router();
const upload = multer();
const projectName = /[0-9a-zA-Z\-_]+$/.exec(__dirname)[0];

(async () => {
  // 这些接口走代理
  const BASE_URL = ' https://easy-mock.bookset.io/mock/5f9e24ae322bda79351ac3c0/adsSystem';
  const AGENT_MAP = [
    '/project/list',
    '/product/list'
  ];
  AGENT_MAP.forEach(url => {
    router.get(url, async (_, res) => {
      
      const {data} = await axios({
        method: 'GET',
        url: `${BASE_URL}${url}`
      });
      res.send(data);
    });
  });

  // 获取弹窗列表
  router.get('/ad/list', async (_, res) => {
    const prefix = `${process.cwd()}/data/${projectName}`;
    const dirs = await fs.readdir(prefix);
    let ret;
    if (!dirs.length) {
      ret = [];
    } else {
      ret = await pMap(dirs, dir => {
        return fs.readJSON(`${prefix}/${dir}`, 'utf8');
      });
    }
    res.send(responseWrapper({
      list: ret,
      total: parseInt(Math.random() * 50)
    }));
  });
  // 获取弹窗详情
  router.get('/ad/detail', async (req, res) => {
    const {id} = req.query;
    const result = await getData(projectName, id);
    res.send(responseWrapper(result));
  });
  // 创建弹窗
  router.post('/ad/create', async (req, res) => {
    const uid = uuid();
    await saveData(projectName, uid, {
      ...req.body,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      id: uid
    });
    res.send(responseWrapper(null));
  });
  // 编辑弹窗
  router.post('/ad/update', async (req, res) => {
    const {id} = req.body;
    await saveData(projectName, id, req.body);
    res.send(responseWrapper(null));
  });
  // 文件删除
  router.post('/ad/delete', async (req, res) => {
    const {id} = req.params;
    await deleteData(projectName, id);
    res.send(responseWrapper(null));
  })
  // 图片上传
  router.post('/uploadPic', upload.any(), async (req, res) => {
    const oriBuffer = req.files[0].buffer;
    const url = await saveFile(projectName, req.files[0].originalname, oriBuffer);
    res.send(responseWrapper({
      url
    }));
  });
  module.exports = router;
})()

function responseWrapper(result) {
  return {
    code: 200,
    msg: 'success',
    result
  }
}