const { root } = require('cheerio');
const fs = require('fs');
const HTMLParser = require('node-html-parser');


const start = async () => {
  await parser();
};

const parser = async () => {
  fs.readdir('./pages', (err, files) => {
    files.forEach(async (file) => {
      let filePath = './pages/' + file;
      
      fs.readFile(filePath, {encoding: 'utf-8'}, async (err, data) => {
        if (!err) {
          let root = HTMLParser.parse(data);
          let rootString = root.toString();
          root.querySelectorAll('img').map((el)=>{
            let oldLine = el.toString();
            let path = el.getAttribute('src')
            path = `{require("../${path}")}`;
            let srcAttr = el.rawAttrs
            let elString = el.toString();
            srcTag = elString.split(' ')[1].replace(/"(.)+/, path);
            elString = elString.split(' ');
            elString[1] = srcTag;
            let newLine = elString.join(' ');
            newLine = newLine.replace(/>/g, '/>')
            //console.log(oldLine);
            //console.log(newLine);
            rootString = rootString.replace(oldLine, newLine);
          })
          rootString = rootString.replace(/br/g, 'br/');
          console.log(rootString);
          let fileName = file.split('.')[0];
          fs.writeFile(`./result/${fileName}.js`, rootString, function (err) {
            if (err) return console.log(err);
            console.log('Well Done =)');
          });
        } else {
            console.log(err);
        }
    });
    });
  });
};

start();
