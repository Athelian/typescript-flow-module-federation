// @flow
import type { Batch } from 'generated/graphql';

/**
 * This is used to do clean up the data for cell input
 * Eg: toggle input which combine 2 values
 */
export default function decorate(batches: Array<Batch>): Array<Object> {
  return batches;
}
