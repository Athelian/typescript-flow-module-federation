export const BATCH_LIST = 'batch.batches.list';
export const BATCH_GET = 'batch.batches.get';
export const BATCH_CREATE = 'batch.batches.create';
export const BATCH_UPDATE = 'batch.batches.update';

const batch = {
  default: [BATCH_LIST, BATCH_GET],
  manager: [BATCH_LIST, BATCH_GET, BATCH_CREATE, BATCH_UPDATE],
};

export default batch;
