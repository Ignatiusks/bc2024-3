const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
.option('-i, --input <path>', 'input file path')
.option('-o, --output <path>', 'output file path')
.option('-d, --display', 'display result in console');
program.parse(process.argv);

const options = program.opts();

if (!options.input) {
console.error('Please, specify input file');
process.exit(1);
}
const inputFilePath = path.resolve(options.input);

if (!fs.existsSync(inputFilePath)) {
console.error('Cannot find input file');
process.exit(1);
}
const inputData = fs.readFileSync(inputFilePath, 'utf8');
const jsonData = JSON.parse(inputData);

let result = '';
jsonData.forEach(item => {
result += `${item.exchangedate}:${item.rate}\n`;
});
if (!options.output && !options.display) {
process.exit(0);
}
if (options.output) {
const outputFilePath = path.resolve(options.output);
fs.writeFileSync(outputFilePath, result, 'utf8');
}
if (options.display) {
console.log(result);
}

