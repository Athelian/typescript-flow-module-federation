// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'modules.Import.header',
    defaultMessage: 'IMPORT FILE IN ZENPORT TEMPLATE',
  },
  downloadTemplate: {
    id: 'modules.Import.downloadTemplate',
    defaultMessage: 'DOWNLOAD TEMPLATE FILE',
  },
  startImport: {
    id: 'modules.Import.startImport',
    defaultMessage: 'START FILE IMPORT',
  },
  pending: {
    id: 'modules.Import.pending',
    defaultMessage: 'NO FILE HAS BEEN UPLOADED',
  },
  in_progress: {
    id: 'modules.Import.inProgress',
    defaultMessage: 'FILE IMPORT IS IN PROGRESS... ',
  },
  succeed: {
    id: 'modules.Import.succeed',
    defaultMessage: 'FILE IMPORT IS COMPLETED',
  },
  failed: {
    id: 'modules.Import.failed',
    defaultMessage: 'FILE IMPORT IS FAILED',
  },
  dropFile: {
    id: 'modules.Import.dropFile',
    defaultMessage: 'DROP YOUR FILE HERE',
  },
  errors: {
    id: 'modules.Import.errors',
    defaultMessage: '{count} ERRORS IS FOUND.',
  },
  noErrors: {
    id: 'modules.Import.noErrors',
    defaultMessage: 'NO ERROR HAS BEEN FOUND.',
  },
  error: {
    id: 'modules.Import.error',
    defaultMessage: 'Data on CellConfig {location} as error: {error}',
  },
});
