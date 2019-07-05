// @flow

export const Status = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUCCEED: 'succeed',
  FAILED: 'failed',
};

export const ImportLifecycle = {
  START: 'Start',
  START_READ: 'StartRead',
  END_READ: 'EndRead',
  START_PREPARE: 'StartPrepare',
  END_PREPARE: 'EndPrepare',
  START_IMPORT: 'StartImport',
  END_IMPORT: 'EndImport',
  END: 'End',
  ERROR: 'Error',
};
