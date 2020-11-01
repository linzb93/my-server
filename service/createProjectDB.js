const fs = require('fs-extra');

module.exports = async dirname => {
  const cwd = process.cwd();
  const projectName = /[0-9a-zA-Z\-_]+$/.exec(dirname)[0];
  try {
    await Promise.all([
      fs.mkdir(`${cwd}/data/${projectName}`, {recursive: true}),
      fs.mkdir(`${cwd}/files/${projectName}`, {recursive: true}),
    ]);
  } catch (e) {
    
  }
}