const path = require('path');
const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const chalk = require('chalk');
const { uniq, difference } = require('ramda');
const JSON5 = require('json5');

const translationFilesPath = path.join('.', 'src','i18n', 'translations');
const filterFiles = item => path.extname(item.path) === '.json';

const translationFiles = klawSync(translationFilesPath, { filter: filterFiles });
const translationFilePaths = translationFiles.map(({ path }) => path);

const translationLang = translationFilePath => path.parse(translationFilePath).name;

console.log(
  `${chalk.green('Checking translations for')} ${chalk.yellow(
    translationFilePaths.map(translationLang).join(', ')
  )}
`
);

const translationList = translationFilePaths.map(translationFilePath => ({
  lang: translationLang(translationFilePath),
  translations: Object.keys(JSON5.parse(fs.readFileSync(translationFilePath))),
}));

const allTranslations = translationList.reduce(
  (acc, { translations }) => uniq([...acc, ...translations]),
  []
);

const missingTranslationList = translationList
  .map(({ lang, translations }) => ({
    lang,
    missingTranslations: difference(allTranslations, translations),
  }))
  .filter(({ missingTranslations }) => missingTranslations.length > 0);

if (missingTranslationList.length === 0) {
  console.log(chalk.green('All translations checked. No Errors.'));
} else {
  console.log(chalk.red('Some translations are missing ...\n'));
  missingTranslationList.forEach(({ lang, missingTranslations }) => {
    console.log(chalk.yellow(lang));
    missingTranslations.forEach(missingTranslation => {
      console.log(`  ${chalk.red(missingTranslation)}`);
    });
  });
}
