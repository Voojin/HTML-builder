const path = require('path');
const fs = require('fs/promises');
const copyDir = require('../04-copy-directory/copy-dir');

fs.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true})
  .then(() => {
    fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
      .then(() => {
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true })
          .then(() => {
            copyDir(path.join(__dirname, 'assets', 'fonts'), path.join(__dirname, 'project-dist', 'assets', 'fonts'));
            copyDir(path.join(__dirname, 'assets', 'img'), path.join(__dirname, 'project-dist', 'assets', 'img'));
            copyDir(path.join(__dirname, 'assets', 'svg'), path.join(__dirname, 'project-dist', 'assets', 'svg'));
          })
          .catch(error => { throw error; });
        fs.readFile(path.join(__dirname, 'template.html'), 'utf-8')
          .then(templateHTML => {
            const templateLines = templateHTML.match(/{{\w+}}/g);
            const fileNames = templateLines.map(name => name.replace(/({{)|(}})/g, ''));
            const countLinesForReplace = fileNames.length;
            let checkReadyIndexFile = 0;
            templateLines.forEach((line, i) => {
              fs.readFile(path.join(__dirname, 'components', `${fileNames[i]}.html`), 'utf-8')
                .then(data => {
                  templateHTML = templateHTML.replace(line, data);
                  checkReadyIndexFile++;
                  if (checkReadyIndexFile === countLinesForReplace) {
                    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateHTML, 'utf-8')
                      .then(() => {
                        console.log('Index file is ready!');
                      })
                      .catch(error => { throw error; });
                  }
                })
                .catch(error => { throw error; });
            });
          })
          .catch(error => { throw error; });
        fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
          .then(dirents => {
            const files = dirents.filter(el => path.extname(el.name) === '.css' && el.isFile()).map(el => el.name);
            const countFiles = files.length;
            let checkReadyStyleFile = 0;
            let styleTemplate = '';
            files.forEach(file => {
              fs.readFile(path.join(__dirname, 'styles', file), 'utf-8')
                .then(data => {
                  styleTemplate += `${data} \n`;
                  checkReadyStyleFile++;
                  if (checkReadyStyleFile === countFiles) {
                    fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), styleTemplate, 'utf-8')
                      .then(() => {
                        console.log('Style file is ready!');
                      })
                      .catch(error => { throw error; });
                  }
                })
                .catch(error => { throw error; });
            });
          })
          .catch(error => { throw error; });
      })
      .catch(error => { throw error; });
  })
  .catch(error => { throw error; });