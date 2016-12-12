const fs = require('fs');
const __ = require('lodash');

const rawFileInput = fs.readFileSync('./input.html', 'utf-8').split('\n');
const result = [];

const stylePatt = /style=\"(.*?)\"/;
const imgPatt = /<img(.*?)>/;

for (let i = 0; i < rawFileInput.length; ++i) {
  const line = rawFileInput[i];
  let processedLine;

  // Proccess inline style string => style object
  if (stylePatt.test(line)) {
    const matcher = line.match(stylePatt);
    processedLine = line.replace(matcher[0], replaceStyle(matcher[1]));
  } else {
    processedLine = line;
  }

  // Process class
  processedLine = processedLine.replace('class="', 'className="');

  // Process for
  processedLine = processedLine.replace('for="', 'htmlFor="');

  // Process hr
  if (processedLine.includes('<hr>')) {
    processedLine = processedLine.replace('<hr>', '<hr />');
  }
  // Process br
  if (processedLine.includes('<br>')) {
    processedLine = processedLine.replace('<br>', '<br />');
  }

  // Process not self-closed img
  if(imgPatt.test(processedLine)) {
    const matcher = line.match(imgPatt);
    console.log('matcher', matcher);

    if (!processedLine.endsWith('/>') && processedLine.endsWith('>')) {
      const newImgStr = matcher[0].replace('>', ' />');
      processedLine = processedLine.replace(matcher[0], newImgStr);
    }
  }

  rawFileInput[i] = processedLine;
}

// for (let i = 0; i < a.length; ++i) {
//   const line = a[i];
//   if (imgPatt.test(line)) {
//     console.log(line)
//   }
// }

// console.log(a);

fs.writeFileSync('./output.html', rawFileInput.reduce((acc, item) => {
  return `${acc}\n${item}`
}), '');

function replaceStyle(style) {
  const styles = style.split(';').filter(item => item.length !== 0);
  return styles.reduce((acc, item, index, arr) => {
    const isLast = index === (arr.length - 1);

    let [styleKey, styleValue] = item.split(':').map(item => item.trim());
    styleKey = __.camelCase(styleKey);
    if (isLast) {
      return `${acc}${styleKey}: '${styleValue}' }}`;
    } else {
      return `${acc}${styleKey}: '${styleValue}', `;
    }
  }, 'style={{ ');
}
