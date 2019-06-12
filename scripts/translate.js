import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';
import Translator from './lib/translator';

const MESSAGES_PATTERN = './build/messages/**/*.json';
const LANG_DIR = './src/i18n/translations/';

const messages = {
  ja: {},
  cn: {},
};
const originalJapanFile = JSON.parse(fs.readFileSync(`${LANG_DIR}ja.json`, 'utf8'));
const originalChineseFile = JSON.parse(fs.readFileSync(`${LANG_DIR}cn.json`, 'utf8'));

const englishMessages = globSync(MESSAGES_PATTERN)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        if (defaultMessage === collection[id]) console.warn(`Duplicate message id: ${id}`);
      }

      if (originalJapanFile[id]) {
        messages.ja[id] = originalJapanFile[id];
      } else {
        messages.ja[id] = defaultMessage;
      }

      if (originalChineseFile[id]) {
        messages.cn[id] = originalChineseFile[id];
      } else {
        messages.cn[id] = defaultMessage;
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

mkdirpSync(LANG_DIR);

fs.writeFileSync(`${LANG_DIR}en.json`, JSON.stringify(englishMessages, null, 2));
fs.writeFileSync(`${LANG_DIR}ja.json`, JSON.stringify(messages.ja, null, 2));
fs.writeFileSync(`${LANG_DIR}cn.json`, JSON.stringify(messages.cn, null, 2));
