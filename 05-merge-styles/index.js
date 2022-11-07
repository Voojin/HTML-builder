const path = require('path')
const fs = require('fs')

const stylesDir = path.join(__dirname, 'styles');
const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

fs.readdir(stylesDir, { withFileTypes: true }, (error, dirents) => {
  if (error) throw error;

  const files = dirents.map(el => el.name).filter(el => path.extname(el) === '.css');
  const countFiles = files.length - 1;
  files.forEach((file, i) => {
    const filePath = path.join(stylesDir, file);
    fs.readFile(filePath, (error, data) => {
      if (error) throw error;
      bundle.write(data);
    });
    if (i === countFiles) {
      console.log('The bundle.css is ready!');
    }
  });
});