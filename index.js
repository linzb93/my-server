const inquirer = require('inquirer');
const fs = require('fs-extra');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {errorLogger} = require('./utils/utils');

(async () => {
  process.on('unhandledRejection', e => {
    errorLogger(e);
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/public', express.static('./files'));
  let config;
  try {
    config = await fs.readJSON('./config.json', 'utf8');
  } catch (e) {
    errorLogger(e);
    return;
  }
  const {projects} = config;
  if (!projects.length) {
    errorLogger('当前没有项目可以加载，退出');
    return;
  }
  if (projects.length === 1) {
    require(`./projects/${projects[0].id}`)(app);
  } else {
    const {answer} = await inquirer.prompt([{
      type: 'list',
      name: 'answer',
      message: '请选择启动的项目',
      choices: projects.map(({name, id}) => ({name, value: id}))
    }]);
    require(`./projects/${answer}`)(app);
  }
  app.listen(5000, () => {
    console.log(`listen on port ${config.port}`);
  });
})();