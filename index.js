const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {errorLogger} = require('./utils/utils');
const resolve = src => path.resolve(__dirname, src);
(async () => {
  process.on('unhandledRejection', e => {
    errorLogger(e);
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/public', express.static(resolve('files')));
  let config;
  try {
    config = await fs.readJSON(resolve('config.json'), 'utf8');
  } catch (e) {
    errorLogger(e);
    return;
  }
  const {projects} = config;
  if (projects.length === 1) {
    require(`./projects/${projects[0].id}`)(app);
  } else if (projects.length > 1) {
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