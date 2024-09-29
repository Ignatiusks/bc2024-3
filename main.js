const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .version('1.0.0')
  .description('Програма для читання JSON-файлу з даними НБУ і запису результату в файл або виведення в консоль')
  .requiredOption('-i, --input <path>', 'шлях до JSON-файлу з даними') // обов'язковий параметр
  .option('-o, --output <path>', 'шлях до файлу для запису результату') // необов'язковий параметр для запису у файл
  .option('-d, --display', 'вивести результат у консоль') // опція для виведення у консоль
  .parse(process.argv);

const options = program.opts();

// Перевірка наявності обов'язкового параметра input
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка чи існує файл
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Функція для читання JSON-файлу
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error('Помилка при читанні або парсингу файлу:', err.message);
    process.exit(1); // Завершуємо програму в разі помилки
  }
}

// Функція для запису результату у файл
function writeToFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Результат записано у файл: ${filePath}`);
  } catch (err) {
    console.error('Помилка при запису файлу:', err.message);
    process.exit(1); // Завершуємо програму в разі помилки
  }
}

// Читаємо вхідний файл
const inputData = readJsonFile(options.input);

// Перевіряємо чи задано опції для виведення або запису
if (!options.output && !options.display) {
  process.exit(0); // Якщо не вказано ні --output, ні --display, програма не робить нічого
}

// Якщо вказано параметр --display, виводимо результат у консоль
if (options.display) {
  console.log('Вміст файлу:', inputData);
}

// Якщо вказано параметр --output, записуємо результат у файл
if (options.output) {
  writeToFile(options.output, inputData);
}


