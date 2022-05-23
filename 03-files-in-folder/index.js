const fs = require('fs');
const path = require('path');

const path2SecretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(path2SecretFolder, { withFileTypes: true }, (error, dirents) => {
  if (error) throw error;

  const files = dirents.filter(el => el.isFile()).map(el => el.name);

  files.map(file => {
    fs.stat(path.join(path2SecretFolder, file), (error, stats) => {
      if (error) throw error;

      const statString = `${path.parse(file).name} - ${path.extname(file).slice(1)} - ${stats.size >= 1024 ? (stats.size / 1024).toFixed(2) : stats.size} ${stats.size >= 1024 ? 'Kb' : 'bytes'}`;

      console.log(statString);
    });
  });
});