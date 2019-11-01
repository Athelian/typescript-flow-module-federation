// @flow
import { getByPath, getByPathWithDefault, isEmpty, isNullOrUndefined } from 'utils/fp';
import { formatEndDate, formatFromDate } from 'utils/date';

type MetricInputType = {
  min?: number,
  max?: number,
  metric: string,
};

type PortType = {
  name?: string,
};

export const isValidOfMetricRangeInput = (input: MetricInputType) =>
  input &&
  !isNullOrUndefined(input.metric) &&
  (!isNullOrUndefined(input.min) || !isNullOrUndefined(input.max));

export const isValidOfPortsInput = (ports: Array<PortType>) =>
  ports && ports.filter(port => !isNullOrUndefined(port)).length > 0;

export const filterPorts = (ports: Array<PortType>): Array<PortType> =>
  ports && ports.filter(port => !isNullOrUndefined(port));

const getFilterValue = (name: string, data: any) => {
  switch (name) {
    case 'exporter':
    case 'forwarder':
      return data.map(d => d.organization && d.organization.id);
    case 'ids':
    case 'tags':
    case 'inCharge':
    case 'supplier':
    case 'warehouse':
      return data.map(d => d.id);
    case 'origin':
      return data.filter(d => !isNullOrUndefined(d)).map(d => d.name);
    case 'createdAt':
    case 'updatedAt':
    case 'deliveredAt':
    case 'expiredAt':
    case 'producedAt':
    case 'cargoReady':
    case 'loadPortDeparture':
    case 'firstTransitPortArrival':
    case 'firstTransitPortDeparture':
    case 'secondTransitPortArrival':
    case 'secondTransitPortDeparture':
    case 'dischargePortArrival':
    case 'customClearance':
    case 'warehouseArrival':
    case 'deliveryReady':
      return {
        ...(data.before && { before: formatEndDate(data.before) }),
        ...(data.after && { after: formatFromDate(data.after) }),
      };
    case 'price': {
      const currency = getByPath('currency.name', data);
      const min = getByPath('min', data);
      const max = getByPath('max', data);
      return {
        ...(isNullOrUndefined(currency) ? {} : { currency }),
        /* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.111.0. To view the error, delete this comment and run
         * Flow. */
        ...(isNullOrUndefined(min) ? {} : { min }),
        ...(isNullOrUndefined(max) ? {} : { max }),
      };
    }

    default:
      return data;
  }
};

const FILTER = {
  order: {
    completelyBatched: null,
    completelyShipped: null,
    showActive: null,
    showArchived: null,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ids: 'ids',
    inCharge: 'inChargeIds',
    exporter: 'exporterIds',
    tags: 'tagIds',
  },
  item: {
    price: 'orderItemPrice',
    createdAt: 'orderItemCreatedAt',
    updatedAt: 'orderItemUpdatedAt',
    exporter: 'productProviderExporterIds',
    supplier: 'productProviderSupplierIds',
    tags: 'productTagIds',
    origin: 'productProviderOrigins',
  },
  batch: {
    deliveredAt: 'batchDeliveredAt',
    tags: 'batchTagIds',
  },
  shipment: {
    cargoReady: 'shipmentCargoReady',
    loadPortDeparture: 'shipmentLoadPortDeparture',
    firstTransitPortArrival: 'shipmentFirstTransitPortArrival',
    firstTransitPortDeparture: 'shipmentFirstTransitPortDeparturel',
    secondTransitPortArrival: 'shipmentSecondTransitPortArrival',
    secondTransitPortDeparture: 'shipmentSecondTransitPortDeparture',
    dischargePortArrival: 'shipmentDischargePortArrival',
    customClearance: 'shipmentCustomClearance',
    warehouseArrival: 'shipmentWarehouseArrival',
    deliveryReady: 'shipmentDeliveryReady',
    forwarder: 'shipmentForwarderIds',
    warehouse: 'shipmentWarehouseIds',
    inCharge: 'shipmentInChargeIds',
    tags: 'shipmentTagIds',
    createdAt: 'shipmentCreatedAt',
    updatedAt: 'shipmentUpdatedAt',
  },
};

const convertActiveFilter = (state: Object, type: string) => {
  const filters = getByPathWithDefault({}, `activeFilters.${type}`, state);
  return filters.reduce((currentQuery, filterName) => {
    if (FILTER[type] && FILTER[type][filterName]) {
      const rawValue = getByPathWithDefault({}, `selectedItems.${type}.${filterName}`, state);
      const filterValue = getFilterValue(filterName, rawValue);
      return Object.assign(currentQuery, {
        [FILTER[type][filterName]]: filterValue,
      });
    }
    return currentQuery;
  }, {});
};

const convertMetricRangeQuery = ({
  min,
  max,
  metric,
}: {
  min: number,
  max: number,
  metric: string,
}) =>
  isNullOrUndefined(min) && isNullOrUndefined(max)
    ? {}
    : {
        /* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.111.0. To view the error, delete this comment and run
         * Flow. */
        ...(isNullOrUndefined(min) ? {} : { min }),
        ...(isNullOrUndefined(max) ? {} : { max }),
        metric,
      };

const convertTotalVolumeRangeQuery = (state: Object) => {
  const activeFilters = getByPathWithDefault({}, `activeFilters.batch`, state);
  if (!activeFilters.includes('totalVolume')) return {};
  const { min, max, metric } = getByPathWithDefault(
    {},
    `selectedItems.batch.totalVolume.value`,
    state
  );

  const query = convertMetricRangeQuery({ min, max, metric });
  return isEmpty(query) ? query : { batchTotalVolume: query };
};

const mergeAirportsAndSeaports = (airports: Array<Object>, seaports: Array<Object>) => [
  ...(isValidOfPortsInput(airports)
    ? filterPorts(airports).map(port => ({ airport: port.name }))
    : []),
  ...(isValidOfPortsInput(seaports)
    ? filterPorts(seaports).map(port => ({ seaport: port.name }))
    : []),
];

const convertPortsQuery = (state: Object) => {
  const activeFilters = getByPathWithDefault([], `activeFilters.shipment`, state);
  if (!activeFilters.includes('airports') && !activeFilters.includes('seaports')) return {};
  const airports = getByPathWithDefault({}, `selectedItems.shipment.airports`, state);
  const seaports = getByPathWithDefault({}, 'selectedItems.shipment.seaports', state);

  const result = {
    ...(isValidOfPortsInput(airports.loadPorts) || isValidOfPortsInput(seaports.loadPorts)
      ? {
          shipmentLoadPorts: mergeAirportsAndSeaports(airports.loadPorts, seaports.loadPorts),
        }
      : {}),
    ...(isValidOfPortsInput(airports.dischargePorts) || isValidOfPortsInput(seaports.dischargePorts)
      ? {
          shipmentDischargePorts: mergeAirportsAndSeaports(
            airports.dischargePorts,
            seaports.dischargePorts
          ),
        }
      : {}),
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.111.0. To view the error, delete this comment and run Flow. */
    ...(isValidOfPortsInput(airports.firstTransitPorts) ||
    isValidOfPortsInput(seaports.firstTransitPorts)
      ? {
          shipmentFirstTransitPorts: mergeAirportsAndSeaports(
            airports.firstTransitPorts,
            seaports.firstTransitPorts
          ),
        }
      : {}),
    ...(isValidOfPortsInput(airports.secondTransitPorts) ||
    isValidOfPortsInput(seaports.secondTransitPorts)
      ? {
          shipmentSecondTransitPorts: mergeAirportsAndSeaports(
            airports.secondTransitPorts,
            seaports.secondTransitPorts
          ),
        }
      : {}),
  };

  return result;
};

const convertPackagingQuery = (state: Object, type: string, prevKey: string) => {
  const activeFilters = getByPathWithDefault([], `activeFilters.${type}`, state);
  if (!activeFilters.includes('packaging')) return {};
  const {
    packageLength,
    packageWidth,
    packageHeight,
    packageVolume,
    packageWeight,
  } = getByPathWithDefault({}, `selectedItems.${type}.packaging`, state);

  const packageLengthQuery = isValidOfMetricRangeInput(packageLength)
    ? convertMetricRangeQuery({ ...packageLength })
    : {};
  const packageWidthQuery = isValidOfMetricRangeInput(packageWidth)
    ? convertMetricRangeQuery({ ...packageWidth })
    : {};
  const packageHeightQuery = isValidOfMetricRangeInput(packageHeight)
    ? convertMetricRangeQuery({ ...packageHeight })
    : {};
  const packageVolumeQuery = isValidOfMetricRangeInput(packageVolume)
    ? convertMetricRangeQuery({ ...packageVolume })
    : {};
  const packageWeightQuery = isValidOfMetricRangeInput(packageWeight)
    ? convertMetricRangeQuery({ ...packageWeight })
    : {};

  const packagingQuery = {};
  if (!isEmpty(packageLengthQuery) || !isEmpty(packageWidthQuery) || !isEmpty(packageHeightQuery)) {
    packagingQuery[`${prevKey}PackageSize`] = {
      ...(isEmpty(packageLengthQuery) ? {} : { length: { ...packageLengthQuery } }),
      /* $FlowFixMe This comment suppresses an error found when upgrading Flow
       * to v0.111.0. To view the error, delete this comment and run Flow. */
      ...(isEmpty(packageWidthQuery) ? {} : { width: { ...packageWidthQuery } }),
      ...(isEmpty(packageHeightQuery) ? {} : { height: { ...packageHeightQuery } }),
    };
  }
  if (!isEmpty(packageVolumeQuery)) {
    packagingQuery[`${prevKey}PackageVolume`] = packageVolumeQuery;
  }
  if (!isEmpty(packageWeightQuery)) {
    packagingQuery[`${prevKey}PackageWeight`] = packageWeightQuery;
  }
  return packagingQuery;
};

const convertArchivedFilter = (state: Object, entityType: string, key: string) => {
  const archived = getByPath(`radioFilters.${entityType}.archived`, state);
  const query = {};
  if (!isNullOrUndefined(archived)) {
    query[key] = archived;
  }
  return query;
};

const covertCompletelyFilter = (state: Object, entityType: string, key: string) => {
  const completed = getByPath(`radioFilters.${entityType}.${key}`, state);
  const query = {};
  if (!isNullOrUndefined(completed)) {
    query[key] = completed;
  }
  return query;
};

export const convertToFilterQuery = (state: Object) => ({
  ...convertActiveFilter(state, 'order'),
  ...convertActiveFilter(state, 'item'),
  ...convertActiveFilter(state, 'batch'),
  ...convertActiveFilter(state, 'shipment'),
  ...convertArchivedFilter(state, 'order', 'archived'),
  ...convertArchivedFilter(state, 'shipment', 'shipmentArchived'),
  ...convertPackagingQuery(state, 'item', 'productProvider'),
  ...convertTotalVolumeRangeQuery(state),
  ...convertPortsQuery(state),
  ...covertCompletelyFilter(state, 'order', 'completelyBatched'),
  ...covertCompletelyFilter(state, 'order', 'completelyShipped'),
});
