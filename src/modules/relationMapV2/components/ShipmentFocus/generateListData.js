// @flow
import type { OrderPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { TOTAL_COLUMNS } from 'modules/relationMapV2/constants';
import { shipmentCoordinates } from './helpers';
import type { EntityLoadedStatus } from '../../store';

const generateCells = memoize(
  ({
    shipment,
    isExpand,
    onExpand,
    queryShipmentsDetail,
    loadStatuses,
    ...helpers
  }: {|
    shipment: Object,
    isExpand: boolean,
    onExpand: Function,
    loadStatuses: EntityLoadedStatus,
    queryShipmentsDetail: Function,
    getContainersSortByShipmentId: Function,
    getBatchesSortByShipmentId: Function,
    getBatchesSortByContainerId: Function,
    getRelatedBy?: Function,
    isLoadingData?: boolean,
    newBatchIDs: Array<string>,
    newContainerIDs: Array<string>,
  |}) => {
    const onClick = () => {
      if (!isExpand) {
        onExpand(expandIds => [...expandIds, shipment?.id ?? '']);
        if (
          loadStatuses[shipment?.id]?.full !== 'loaded' &&
          loadStatuses[shipment?.id]?.full !== 'loading'
        ) {
          queryShipmentsDetail([shipment?.id]);
        }
      } else {
        onExpand(expandIds => expandIds.filter(id => id !== (shipment?.id ?? '')));
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
    loadStatuses,
    ...helpers
  }: {|
    shipments: Array<OrderPayload>,
    expandRows: Array<string>,
    setExpandRows: Function,
    loadStatuses: EntityLoadedStatus,
    queryShipmentsDetail: Function,
    getContainersSortByShipmentId: Function,
    getBatchesSortByShipmentId: Function,
    getBatchesSortByContainerId: Function,
    getRelatedBy: Function,
    newBatchIDs: Array<string>,
    newContainerIDs: Array<string>,
  |}) => {
    const emptyFirstCells = [...Array(5)].map(() => ({
      cell: null,
      isExpand: false,
      onClick: () => {},
      shipment: {},
    }));

    const result = [emptyFirstCells]; // empty 1st cell for header

    shipments.forEach(shipment => {
      const isExpand = expandRows.includes(shipment?.id ?? '');

      const { cells, onClick } = generateCells({
        shipment,
        isExpand,
        onExpand: setExpandRows,
        loadStatuses,
        isLoadingData: loadStatuses[shipment?.id]?.full === 'loading',
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
