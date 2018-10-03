import * as fs from 'fs';
import replace from 'replace-in-file';
import { sync as globSync } from 'glob';

const MESSAGES_PATTERN = './src/**/*/messages.js';

const langFile = './src/i18n/translations/en.json';

const dictionary = JSON.parse(fs.readFileSync(langFile, 'utf8'));

for (const key in dictionary) {
  if (dictionary.hasOwnProperty(key)) {
    const value = dictionary[key];
    console.warn('key', key);
    console.warn('value', dictionary[key]);
    const options = {
      files: MESSAGES_PATTERN,
      from: `id: '${key}',`,
      to: `id: '${key}', defaultMessage: '${value}',`,
    };
    try {
      const changes = replace.sync(options);
      console.log('Modified files:', changes.join(', '));
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
}
