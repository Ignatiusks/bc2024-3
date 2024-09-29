const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

program
  .version('1.0.0')
  .description('Програма для читання JSON-файлу з даними курсів НБУ та запису результатів')
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
    process.exit(1);
  }
}

// Функція для запису результату у файл
function writeToFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
    console.log(`Результат записано у файл: ${filePath}`);
  } catch (err) {
    console.error('Помилка при запису файлу:', err.message);
    process.exit(1);
  }
}

// Функція для форматування даних
function formatCurrencyData(data) {
  return data
    .map(entry => {
      // Перевіряємо, чи є необхідні поля
      if (entry.exchangedate && entry.rate !== undefined) {
        return `${entry.exchangedate}:${entry.rate}`;
      } else {
        // Якщо поля відсутні або некоректні
        return 'Неправильна структура даних';
      }
    })
    .join('\n');
}

// Читаємо вхідний файл
const inputData = readJsonFile(options.input);

// Перевірка чи вхідні дані є масивом
if (!Array.isArray(inputData)) {
  console.error('Очікується масив курсів валют у файлі.');
  process.exit(1);
}

// Форматуємо дані
const formattedData = formatCurrencyData(inputData);

// Якщо не вказано ні --output, ні --display, програма нічого не робить
if (!options.output && !options.display) {
  process.exit(0);
}

// Якщо вказано параметр --display, виводимо результат у консоль
if (options.display) {
  console.log(formattedData);
}

// Якщо вказано параметр --output, записуємо результат у файл
if (options.output) {
  writeToFile(options.output, formattedData);
}



