const router = require('./router');
const createProjectDB = require('../../service/createProjectDB');

module.exports = async app => {
  await createProjectDB(__dirname);
  app.use('/', router);
};