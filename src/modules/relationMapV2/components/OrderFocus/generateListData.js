// @flow
import type { OrderPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { getByPathWithDefault } from 'utils/fp';
import { TOTAL_COLUMNS } from 'modules/relationMapV2/constants';
import { orderCoordinates } from './helpers';

const generateCells = memoize(
  ({ order, isExpand, onExpand }: {| order: Object, isExpand: boolean, onExpand: Function |}) => {
    const isLoadedData =
      getByPathWithDefault([], 'orderItems', order).length ===
      getByPathWithDefault(0, 'orderItemCount', order);
    const onClick = () => {
      if (!isExpand) {
        onExpand(expandIds => [...expandIds, getByPathWithDefault('', 'id', order)]);
      } else {
        onExpand(expandIds => expandIds.filter(id => id !== getByPathWithDefault('', 'id', order)));
      }
    };
    const cells = orderCoordinates({ isExpand, order, isLoadedData });
    return { cells, onClick, isExpand };
  }
);

const generateListData = memoize(
  ({
    orders,
    expandRows,
    setExpandRows,
  }: {|
    orders: Array<OrderPayload>,
    expandRows: Array<string>,
    setExpandRows: Function,
  |}) => {
    const result = [
      [
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          order: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          order: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          order: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          order: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          order: {},
        },
      ],
    ]; // empty 1st cell for header
    orders.forEach(order => {
      const isExpand = expandRows.includes(getByPathWithDefault('', 'id', order));
      const { cells, onClick } = generateCells({
        order,
        isExpand,
        onExpand: setExpandRows,
      });
      let counter = 0;
      let row = [];
      cells.forEach(cell => {
        counter += 1;
        row.push({
          cell,
          onClick,
          isExpand,
          order,
        });
        if (counter % TOTAL_COLUMNS === 0) {
          result.push(row);
          row = [];
        }
      });
    });
    return result;
  }
);

export default generateListData;