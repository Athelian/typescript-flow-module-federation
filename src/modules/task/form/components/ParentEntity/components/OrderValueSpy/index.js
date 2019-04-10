// @flow
import * as React from 'react';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { orderDetailQuery } from './query';

type Props = {
  values: Object,
};

const MappingFields = {
  OrderIssuedAt: 'issuedAt',
};

export default function OrderValueSpy({ values }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_ORDER_VALUE', async (field: string, entityId: string) => {
      logger.warn({
        field,
        entityId,
      });

      if (values.id) {
        emitter.emit('LIVE_VALUE', getByPath(MappingFields[field], values));
      } else {
        logger.warn('query order data for id', client);
        emitter.emit('LIVE_VALUE_PROCESS', true);
        const { data } = await client.query({
          query: orderDetailQuery,
          variables: { id: entityId },
          fetchPolicy: 'cache-first',
        });
        emitter.emit('LIVE_VALUE_PROCESS', false);
        emitter.emit('LIVE_VALUE', data);
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_ORDER_VALUE');
    };
  });
  return null;
}
