// @flow
import type { OrderPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { getByPathWithDefault } from 'utils/fp';
import { TOTAL_COLUMNS } from 'modules/relationMapV2/constants';
import { shipmentCoordinates } from './helpers';

const generateCells = memoize(
  ({
    shipment,
    isExpand,
    onExpand,
    ...helpers
  }: {|
    shipment: Object,
    isExpand: boolean,
    onExpand: Function,
    getContainersSortByShipmentId: Function,
    getBatchesSortByShipmentId: Function,
    getBatchesSortByContainerId: Function,
    getRelatedBy?: Function,
    newBatchIDs: Array<string>,
    newContainerIDs: Array<string>,
  |}) => {
    const onClick = () => {
      if (!isExpand) {
        onExpand(expandIds => [...expandIds, getByPathWithDefault('', 'id', shipment)]);
      } else {
        onExpand(expandIds =>
          expandIds.filter(id => id !== getByPathWithDefault('', 'id', shipment))
        );
      }
    };
    const cells = shipmentCoordinates({ isExpand, shipment, ...helpers });
    return { cells, onClick, isExpand };
  }
);

const generateListData = memoize(
  ({
    shipments,
    expandRows,
    setExpandRows,
    ...helpers
  }: {|
    shipments: Array<OrderPayload>,
    expandRows: Array<string>,
    setExpandRows: Function,
    getContainersSortByShipmentId: Function,
    getBatchesSortByShipmentId: Function,
    getBatchesSortByContainerId: Function,
    getRelatedBy: Function,
    newBatchIDs: Array<string>,
    newContainerIDs: Array<string>,
  |}) => {
    const result = [
      [
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          shipment: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          shipment: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          shipment: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          shipment: {},
        },
        {
          cell: null,
          isExpand: false,
          onClick: () => {},
          shipment: {},
        },
      ],
    ]; // empty 1st cell for header
    shipments.forEach(shipment => {
      const isExpand = expandRows.includes(getByPathWithDefault('', 'id', shipment));
      const { cells, onClick } = generateCells({
        shipment,
        isExpand,
        onExpand: setExpandRows,
        ...helpers,
      });
      let counter = 0;
      let row = [];
      cells.forEach(cell => {
        counter += 1;
        row.push({
          cell,
          onClick,
          isExpand,
          shipment,
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
