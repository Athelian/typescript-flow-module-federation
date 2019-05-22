// @flow
import { defineMessages } from 'react-intl';

const messages: Object = {
  BatchQuantityRevisionType: defineMessages({
    Produced: {
      id: 'enum.BatchQuantityRevisionType.Produced',
      defaultMessage: 'Produced',
    },
    Dispatched: {
      id: 'enum.BatchQuantityRevisionType.Dispatched',
      defaultMessage: 'Dispatched',
    },
    Shipped: {
      id: 'enum.BatchQuantityRevisionType.Shipped',
      defaultMessage: 'Shipped',
    },
    Inspected: {
      id: 'enum.BatchQuantityRevisionType.Inspected',
      defaultMessage: 'Inspected',
    },
    WarehouseArrival: {
      id: 'enum.BatchQuantityRevisionType.WarehouseArrival',
      defaultMessage: 'WarehouseArrival',
    },
    Other: {
      id: 'enum.BatchQuantityRevisionType.Other',
      defaultMessage: 'Other',
    },
  }),
};

export default messages;
