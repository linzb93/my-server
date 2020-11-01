const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();

// 存入数据
exports.saveData = async (projectName, filename, data) => {
  await fs.writeFile(`${cwd}/data/${projectName}/${filename}.json`, JSON.stringify(data));
}

// 读取单条数据
exports.getData = async (projectName, filename) => {
  const data = await fs.readJSON(`${cwd}/data/${projectName}/${filename}.json`, 'utf8');
  return data;
}

// 存入静态文件
exports.saveFile = async (projectName, filename, buf) => {
  const {port} = await fs.readJSON(`${cwd}/config.json`, 'utf8');
  const basename = filename.replace(/\.[a-zA-Z0-9]+$/, '');
  const file = `${basename}-${Math.random().toString().slice(2,6)}${path.extname(filename)}`;
  await fs.writeFile(`${cwd}/files/${projectName}/${file}`, buf);
  return `http://localhost:${port}/public/${projectName}/${file}`;
}