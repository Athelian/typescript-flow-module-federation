// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import usePermission from 'hooks/usePermission';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import Portal from 'components/Portal';
import { NewButton, ExportButton } from 'components/Buttons';
import ShipmentList from './list';
import { shipmentsExportQuery } from './query';
import { shipmentSortMessages } from './messages';

type Props = {
  intl: IntlShape,
};

type State = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
  page: number,
};

const getInitFilter = () => {
  const state: State = {
    viewType: 'grid',
    filter: {
      query: '',
      archived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

const ShipmentListModule = (props: Props) => {
  const { intl } = props;

  const sortFields = [
    { title: intl.formatMessage(shipmentSortMessages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(shipmentSortMessages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(shipmentSortMessages.shipmentId), value: 'no' },
    { title: intl.formatMessage(shipmentSortMessages.blNo), value: 'blNo' },
    { title: intl.formatMessage(shipmentSortMessages.vesselName), value: 'vesselName' },
    { title: intl.formatMessage(shipmentSortMessages.cargoReady), value: 'cargoReady' },
    {
      title: intl.formatMessage(shipmentSortMessages.loadPortDeparture),
      value: 'loadPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.firstTransitPortArrival),
      value: 'firstTransitPortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.firstTransitPortDeparture),
      value: 'firstTransitPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.secondTransitPortArrival),
      value: 'secondTransitPortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.secondTransitPortDeparture),
      value: 'secondTransitPortDeparture',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.dischargePortArrival),
      value: 'dischargePortArrival',
    },
    {
      title: intl.formatMessage(shipmentSortMessages.customClearance),
      value: 'customClearance',
    },
    { title: intl.formatMessage(shipmentSortMessages.warehouseArrival), value: 'warehouseArrival' },
    {
      title: intl.formatMessage(shipmentSortMessages.deliveryReady),
      value: 'deliveryReady',
    },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterShipment'
  );
  const { hasPermission } = usePermission();
  return (
    <>
      <Portal>
        <FilterToolBar
          icon="SHIPMENT"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
        />
        {hasPermission(SHIPMENT_CREATE) && (
          <Link to="new">
            <NewButton />
          </Link>
        )}
        <ExportButton
          type="Shipments"
          exportQuery={shipmentsExportQuery}
          variables={{
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
            filterBy: filterAndSort.filter,
          }}
        />
      </Portal>
      <ShipmentList {...queryVariables} />
    </>
  );
};

export default injectIntl(ShipmentListModule);
