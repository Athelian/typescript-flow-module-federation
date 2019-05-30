// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import type { EntityTypes, ActiveFilters, FilterToggles } from '../type';
import { BaseFilterMenu } from './components';
import messages from './messages';
import { FilterMenuWrapperStyle } from './style';

type Props = {
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  selectedEntityType: EntityTypes,
  activeFilters: ActiveFilters,
  radioFilters: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  filterToggles: FilterToggles,
  selectedFilterItem: string,
  dispatch: (action: { type: string, payload: Object }) => void,
};

const getSelectDataByType = (selectedEntityType: string) => (
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  field: string
) => {
  const result = selectedItems[selectedEntityType][field] || [];
  return result;
};

const getFilterMenu = ({
  selectedEntityType,
  selectedItems,
  selectedFilterItem,
  parsedActiveFilters,
  parsedRadioFilters,
  parsedFilterToggles,
  dispatch,
  isExporter,
}: {
  selectedEntityType: EntityTypes,
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
  selectedFilterItem: string,
  parsedActiveFilters: Object,
  parsedRadioFilters: Object,
  parsedFilterToggles: Object,
  dispatch: (action: { type: string, payload: Object }) => void,
  isExporter: boolean,
}) => {
  const getSelectData = getSelectDataByType(selectedEntityType);
  switch (selectedEntityType) {
    case 'order': {
      const filtersMap = [
        {
          label: <FormattedMessage {...messages.order} />,
          icon: 'ORDER',
          filters: [
            {
              name: 'ids',
              field: 'poNo',
              label: <FormattedMessage {...messages.order} />,
              data: getSelectData(selectedItems, 'ids'),
            },
            ...(isExporter
              ? []
              : [
                  {
                    name: 'exporter',
                    field: 'group.name',
                    label: <FormattedMessage {...messages.exporter} />,
                    data: getSelectData(selectedItems, 'exporter'),
                  },
                ]),
            {
              name: 'inCharge',
              field: 'id',
              label: <FormattedMessage {...messages.inCharge} />,
              data: getSelectData(selectedItems, 'inCharge'),
            },
            ...(isExporter
              ? []
              : [
                  {
                    name: 'tags',
                    field: 'name',
                    label: <FormattedMessage {...messages.tags} />,
                    data: getSelectData(selectedItems, 'tags'),
                  },
                ]),
            {
              name: 'createdAt',
              field: 'createdAt',
              label: <FormattedMessage {...messages.createdAt} />,
              data: getSelectData(selectedItems, 'createdAt'),
            },
            {
              name: 'updatedAt',
              field: 'updatedAt',
              label: <FormattedMessage {...messages.updatedAt} />,
              data: getSelectData(selectedItems, 'updatedAt'),
            },
          ],
        },
      ];

      const archivedUI = [
        {
          name: 'all',
          label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
          field: 'archived',
          value: null,
        },
        {
          name: 'active',
          label: <FormattedMessage id="modules.relationMap.active" defaultMessage="ACTIVE" />,
          field: 'archived',
          value: false,
        },
        {
          name: 'archived',
          label: <FormattedMessage id="modules.relationMap.archived" defaultMessage="ARCHIVED" />,
          field: 'archived',
          value: true,
        },
      ];

      const togglesMap = [];

      const completelyBatchedUI = [
        {
          name: 'all',
          label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
          field: 'completelyBatched',
          value: null,
        },
        {
          name: 'completely',
          label: (
            <FormattedMessage
              id="modules.relationMap.notFullyBatched"
              defaultMessage="NOT FULLY BATCHED"
            />
          ),
          field: 'completelyBatched',
          value: false,
        },
      ];

      const completelyShippedUI = [
        {
          name: 'all',
          label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
          field: 'completelyShipped',
          value: null,
        },
        {
          name: 'completely',
          label: (
            <FormattedMessage
              id="modules.relationMap.notFullyShipped"
              defaultMessage="NOT FULLY SHIPPED"
            />
          ),
          field: 'completelyShipped',
          value: false,
        },
      ];
      return (
        <BaseFilterMenu
          filtersMap={filtersMap}
          togglesMap={togglesMap}
          archivedUI={archivedUI}
          completelyBatchedUI={completelyBatchedUI}
          completelyShippedUI={completelyShippedUI}
          parsedRadioFilters={parsedRadioFilters}
          entityType="order"
          parsedActiveFilters={parsedActiveFilters}
          parsedFilterToggles={parsedFilterToggles}
          selectedFilterItem={selectedFilterItem}
          dispatch={dispatch}
        />
      );
    }
    case 'batch': {
      const filtersMap = [
        {
          label: <FormattedMessage {...messages.batch} />,
          icon: 'BATCH',
          filters: [
            {
              name: 'deliveredAt',
              label: <FormattedMessage {...messages.deliveredAt} />,
              data: getSelectData(selectedItems, 'deliveredAt'),
            },
            {
              name: 'totalVolume',
              label: <FormattedMessage {...messages.totalVolume} />,
              data: getSelectData(selectedItems, 'totalVolume'),
            },
            ...(isExporter
              ? []
              : [
                  {
                    name: 'tags',
                    field: 'name',
                    label: <FormattedMessage {...messages.tags} />,
                    data: getSelectData(selectedItems, 'tags'),
                  },
                ]),
          ],
        },
      ];

      return (
        <BaseFilterMenu
          filtersMap={filtersMap}
          entityType="batch"
          parsedActiveFilters={parsedActiveFilters}
          parsedFilterToggles={parsedFilterToggles}
          selectedFilterItem={selectedFilterItem}
          dispatch={dispatch}
        />
      );
    }
    case 'shipment': {
      const filtersMap = [
        {
          label: <FormattedMessage {...messages.shipment} />,
          icon: 'SHIPMENT',
          filters: [
            {
              name: 'forwarder',
              field: 'group.name',
              label: <FormattedMessage {...messages.forwarder} />,
              data: getSelectData(selectedItems, 'forwarder'),
            },
            {
              name: 'warehouse',
              field: 'name',
              label: (
                <FormattedMessage id="modules.relationMap.warehouse" defaultMessage="WAREHOUSE" />
              ),
              data: getSelectData(selectedItems, 'warehouse'),
            },
            {
              name: 'seaports',
              label: <FormattedMessage {...messages.seaports} />,
              data: getSelectData(selectedItems, 'seaports'),
            },
            {
              name: 'airports',
              label: <FormattedMessage {...messages.airports} />,
              data: getSelectData(selectedItems, 'airports'),
            },
            {
              name: 'cargoReady',
              label: <FormattedMessage {...messages.cargoReady} />,
              data: getSelectData(selectedItems, 'cargoReady'),
            },
            {
              name: 'loadPortDeparture',
              label: <FormattedMessage {...messages.loadPortDeparture} />,
              data: getSelectData(selectedItems, 'loadPortDeparture'),
            },
            {
              name: 'firstTransitPortArrival',
              label: <FormattedMessage {...messages.firstTransitPortArrival} />,
              data: getSelectData(selectedItems, 'firstTransitPortArrival'),
            },
            {
              name: 'firstTransitPortDeparture',
              label: <FormattedMessage {...messages.firstTransitPortDeparture} />,
              data: getSelectData(selectedItems, 'firstTransitPortDeparture'),
            },
            {
              name: 'secondTransitPortArrival',
              label: <FormattedMessage {...messages.secondTransitPortArrival} />,
              data: getSelectData(selectedItems, 'cargoReady'),
            },
            {
              name: 'secondTransitPortDeparture',
              label: <FormattedMessage {...messages.secondTransitPortDeparture} />,
              data: getSelectData(selectedItems, 'secondTransitPortDeparture'),
            },
            {
              name: 'dischargePortArrival',
              label: <FormattedMessage {...messages.dischargePortArrival} />,
              data: getSelectData(selectedItems, 'dischargePortArrival'),
            },
            {
              name: 'customClearance',
              label: <FormattedMessage {...messages.customClearance} />,
              data: getSelectData(selectedItems, 'customClearance'),
            },
            {
              name: 'warehouseArrival',
              label: <FormattedMessage {...messages.warehouseArrival} />,
              data: getSelectData(selectedItems, 'warehouseArrival'),
            },
            {
              name: 'deliveryReady',
              label: <FormattedMessage {...messages.deliveryReady} />,
              data: getSelectData(selectedItems, 'deliveryReady'),
            },
            ...(isExporter
              ? []
              : [
                  {
                    name: 'tags',
                    field: 'name',
                    label: <FormattedMessage {...messages.tags} />,
                    data: getSelectData(selectedItems, 'tags'),
                  },
                ]),
            {
              name: 'createdAt',
              label: <FormattedMessage {...messages.createdAt} />,
              data: getSelectData(selectedItems, 'createdAt'),
            },
            {
              name: 'updatedAt',
              label: <FormattedMessage {...messages.updatedAt} />,
              data: getSelectData(selectedItems, 'updatedAt'),
            },
          ],
        },
      ];

      const archivedUI = [
        {
          name: 'all',
          label: <FormattedMessage id="modules.relationMap.all" defaultMessage="ALL" />,
          field: 'archived',
          value: null,
        },
        {
          name: 'active',
          label: <FormattedMessage id="modules.relationMap.active" defaultMessage="ACTIVE" />,
          field: 'archived',
          value: false,
        },
        {
          name: 'archived',
          label: <FormattedMessage id="modules.relationMap.archived" defaultMessage="ARCHIVED" />,
          field: 'archived',
          value: true,
        },
      ];

      const togglesMap = [];
      return (
        <BaseFilterMenu
          filtersMap={filtersMap}
          togglesMap={togglesMap}
          entityType="shipment"
          parsedActiveFilters={parsedActiveFilters}
          archivedUI={archivedUI}
          parsedRadioFilters={parsedRadioFilters}
          parsedFilterToggles={parsedFilterToggles}
          selectedFilterItem={selectedFilterItem}
          dispatch={dispatch}
        />
      );
    }
    default:
      return null;
  }
};

function FilterMenu({
  selectedEntityType,
  activeFilters,
  radioFilters,
  filterToggles,
  selectedFilterItem,
  selectedItems,
  dispatch,
}: Props) {
  const { isExporter } = useUser();

  const parsedActiveFilters = activeFilters[selectedEntityType];
  const parsedRadioFilters = radioFilters[selectedEntityType];
  const parsedFilterToggles = filterToggles[selectedEntityType];

  return (
    <div className={FilterMenuWrapperStyle}>
      {getFilterMenu({
        selectedEntityType,
        selectedItems,
        selectedFilterItem,
        parsedActiveFilters,
        parsedRadioFilters,
        parsedFilterToggles,
        dispatch,
        isExporter: isExporter(),
      })}
    </div>
  );
}

export default React.memo<Props>(FilterMenu);
