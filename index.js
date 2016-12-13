const fs = require('fs');
const __ = require('lodash');

const rawFileInput = fs.readFileSync('./input.html', 'utf-8').split('\n');
const result = [];

const stylePatt = /style=\"(.*?)\"/;
const imgPatt = /<img(.*?)>/;
const inputPatt = /<input(.*?)>/;
const labelPatt = /<label(.*?)>/;
const commentPatt = /<!--(.*?)-->/;

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
    // console.log('processedLine img', processedLine);

    const matcher = processedLine.match(imgPatt);
    // console.log('matcher', matcher);

    if (!matcher[0].endsWith('/>') && matcher[0].endsWith('>')) {
      const newImgStr = matcher[0].replace('>', ' />');
      processedLine = processedLine.replace(matcher[0], newImgStr);
    }
  }

  // Process not self-closed input
  if(inputPatt.test(processedLine)) {
    const matcher = processedLine.match(inputPatt);

    if (!matcher[0].endsWith('/>') && matcher[0].endsWith('>')) {
      const newImgStr = matcher[0].replace('>', ' />');
      processedLine = processedLine.replace(matcher[0], newImgStr);
    }
  }

  // Process label htmlFor
  if(labelPatt.test(processedLine)) {
    const matcher = processedLine.match(labelPatt);
    // console.log('matcher', matcher);

    if (!matcher[0].includes('htmlFor')) {
      processedLine = processedLine.replace('<label', '<label htmlFor="label"');
    }
  }

  // Process <!-- -->
  if(commentPatt.test(processedLine)) {
    const matcher = processedLine.match(commentPatt);
    console.log('matcher', matcher);
    let jsxCommentStr;
    if (matcher[1][0] === ' ') {
      jsxCommentStr = matcher[0].replace('<!--', '{/*');
    } else {
      jsxCommentStr = matcher[0].replace('<!--', '{/* ');
    }
    const matcher1Length = matcher[1].length;
    if (matcher[1][matcher1Length - 1] === ' ') {
      jsxCommentStr = jsxCommentStr.replace('-->', '*/}');
    } else {
      jsxCommentStr = jsxCommentStr.replace('-->', ' */}');
    }
    processedLine = processedLine.replace(matcher[0], jsxCommentStr);
  }

  // if processedLine is empty, skip
  if (processedLine.trim().length === 0) {
    continue;
  }

  result.push(processedLine);
}

// for (let i = 0; i < a.length; ++i) {
//   const line = a[i];
//   if (imgPatt.test(line)) {
//     console.log(line)
//   }
// }

// console.log(a);

fs.writeFileSync('./output.html', result.reduce((acc, item) => {
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
