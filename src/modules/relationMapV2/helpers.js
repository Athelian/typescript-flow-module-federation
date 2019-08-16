// @flow
import type {
  UserPayload,
  OrganizationPayload,
  TaskCount,
  Todo,
  CustomFields,
  Price,
  Timeline,
  TimelineDate,
  ProductPayload,
  ProductProviderPayload,
  OrderPayload,
  OrderItemPayload,
  BatchPayload,
  ShipmentPayload,
  ContainerPayload,
} from 'generated/graphql';
/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';

const userGenerator = (): UserPayload => {
  return {
    id: faker.random.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    role: 'default',
    superAdmin: false,
    tags: [],
    createdAt: faker.date.future(),
    updatedAt: faker.date.future(),
    disabled: false,
    roles: [],
    language: 'ja',
    timezone: '+09:00',
    __typename: 'User',
  };
};

const taskCountGenerator = (): TaskCount => {
  return {
    count: faker.random.number(),
    remain: faker.random.number(),
    inProgress: faker.random.number(),
    completed: faker.random.number(),
    rejected: faker.random.number(),
    approved: faker.random.number(),
    skipped: faker.random.number(),
    delayed: faker.random.number(),
    __typename: 'TaskCount',
  };
};

const timelineGenerator = (): Timeline => {
  return {
    unreadCount: 0,
    entries: {
      nodes: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
      __typename: 'EntryPaginatedList',
    },
    __typename: 'Timeline',
  };
};

const groupGenerator = (): OrganizationPayload => {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    createdAt: faker.date.future(),
    updatedAt: faker.date.future(),
    disabled: false,
    dummy: false,
    partners: {
      __typename: 'PartnerPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    types: [],
    users: {
      __typename: 'UserPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    __typename: 'Organization',
  };
};

const todoGenerator = (): Todo => {
  return {
    tasks: [],
    completedCount: faker.random.number(),
    inProgressCount: faker.random.number(),
    remainingCount: faker.random.number(),
    taskCount: taskCountGenerator(),
    __typename: 'Todo',
  };
};

const customFieldsGenerator = (): CustomFields => {
  return {
    __typename: 'CustomFields',
    fieldValues: [],
    fieldDefinitions: [],
  };
};

const priceGenerator = (): Price => {
  return {
    _typename: 'Price',
    amount: faker.random.number(),
    currency: 'USD',
  };
};

export const orderGenerator = (): OrderPayload => {
  return {
    id: faker.random.uuid(),
    archived: faker.random.boolean(),
    batchCount: faker.random.number(),
    batchShippedCount: faker.random.number(),
    containers: [],
    createdAt: faker.date.future(),
    currency: 'USD',
    customFields: customFieldsGenerator(),
    exporter: groupGenerator(),
    files: [],
    importer: groupGenerator(),
    inCharges: [],
    orderItemCount: faker.random.number(),
    orderItems: [],
    ownedBy: groupGenerator(),
    poNo: faker.name.findName(),
    containerCount: faker.random.number(),
    shipmentCount: faker.random.number(),
    shipments: [],
    tags: [],
    timeline: timelineGenerator(),
    todo: todoGenerator(),
    totalPrice: priceGenerator(),
    totalBatched: 0,
    totalOrdered: 0,
    totalShipped: 0,
    updatedAt: faker.date.future(),
    updatedBy: userGenerator(),
  };
};

const productGenerator = (): ProductPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'Product',
    archived: faker.random.boolean(),
    batches: {
      __typename: 'BatchPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    containers: {
      __typename: 'ContainerPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    createdAt: faker.date.future(),
    customFields: customFieldsGenerator(),
    files: [],
    importer: groupGenerator(),
    name: faker.name.findName(),
    orderItems: {
      __typename: 'OrderItemPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    orders: {
      __typename: 'OrderPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    ownedBy: groupGenerator(),
    productProviders: [],
    serial: faker.name.findName(),
    shipments: {
      __typename: 'ShipmentPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    tags: [],
    timeline: timelineGenerator(),
    todo: todoGenerator(),
    updatedAt: faker.date.future(),
  };
};

const productProviderGenerator = (): ProductProviderPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'ProductProvider',
    archived: faker.random.boolean(),
    autoCalculatePackageVolume: faker.random.boolean(),
    autoCalculateUnitVolume: faker.random.boolean(),
    batches: {
      __typename: 'BatchPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    createdAt: faker.date.future(),
    customFields: customFieldsGenerator(),
    exporter: groupGenerator(),
    files: [],
    name: faker.name.findName(),
    ownedBy: groupGenerator(),
    packages: [],
    product: productGenerator(),
    referenced: faker.random.boolean(),
    sort: faker.random.number(),
    timeline: timelineGenerator(),
    todo: todoGenerator(),
    updatedAt: faker.date.future(),
  };
};

export const orderItemGenerator = (): OrderItemPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'OrderItem',
    archived: faker.random.boolean(),
    batchCount: faker.random.number(),
    batchShippedCount: faker.random.number(),
    batches: [],
    createdAt: faker.date.future(),
    customFields: customFieldsGenerator(),
    files: [],
    no: faker.name.findName(),
    order: orderGenerator(),
    ownedBy: groupGenerator(),
    price: priceGenerator(),
    productProvider: productProviderGenerator(),
    quantity: faker.random.number(),
    shipmentCount: faker.random.number(),
    shipments: [],
    sort: faker.random.number(),
    tags: [],
    timeline: timelineGenerator(),
    todo: todoGenerator(),
    totalBatched: faker.random.number(),
    totalPrice: priceGenerator(),
    totalShipped: faker.random.number(),
    updatedAt: faker.date.future(),
  };
};

export const batchGenerator = (): BatchPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'Batch',
    archived: faker.random.boolean(),
    autoCalculatePackageQuantity: faker.random.boolean(),
    autoCalculatePackageVolume: faker.random.boolean(),
    batchQuantityRevisions: [],
    containerSort: faker.random.number(),
    createdAt: faker.date.future(),
    customFields: customFieldsGenerator(),
    latestQuantity: faker.random.number(),
    no: faker.name.findName(),
    orderItem: orderItemGenerator(),
    ownedBy: groupGenerator(),
    quantity: faker.random.number(),
    shipmentSort: faker.random.number(),
    sort: faker.random.number(),
    tags: [],
    todo: todoGenerator(),
    totalVolume: {
      value: faker.random.number(),
      metric: 'm',
    },
    updatedAt: faker.date.future(),
  };
};

const timelineDateGenerator = (): TimelineDate => {
  return {
    __typename: 'TimelineDate',
    assignedTo: [userGenerator()],
    createdAt: faker.date.future(),
    id: faker.random.uuid(),
    ownedBy: groupGenerator(),
    timelineDateRevisions: [],
    updatedAt: faker.date.future(),
  };
};

export const shipmentGenerator = (): ShipmentPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'Shipment',
    archived: faker.random.boolean(),
    batchCount: faker.random.number(),
    batches: [],
    batchesWithoutContainer: [],
    cargoReady: timelineDateGenerator(),
    containerCount: faker.random.number(),
    containerGroups: [],
    containerTypeCounts: [],
    containers: [],
    createdAt: faker.date.future(),
    customFields: customFieldsGenerator(),
    files: [],
    forwarders: [],
    importer: groupGenerator(),
    inCharges: [userGenerator()],
    integrationLinks: [],
    no: faker.name.findName(),
    orderCount: faker.random.number(),
    orderItemCount: faker.random.number(),
    ownedBy: groupGenerator(),
    tags: [],
    timeline: timelineGenerator(),
    todo: todoGenerator(),
    totalPackageQuantity: faker.random.number(),
    totalVolume: {
      value: faker.random.number(),
      metric: 'm',
    },
    updatedAt: faker.date.future(),
    voyages: [],
  };
};

export const containerGenerator = (): ContainerPayload => {
  return {
    id: faker.random.uuid(),
    __typename: 'Container',
    archived: faker.random.boolean(),
    autoCalculatedFreeTimeStartDate: faker.random.boolean(),
    batchCount: faker.random.number(),
    batches: [batchGenerator()],
    createdAt: faker.date.future(),
    departureDateAssignedTo: [userGenerator()],
    no: faker.name.findName(),
    orderItemCount: faker.random.number(),
    ownedBy: groupGenerator(),
    shipment: shipmentGenerator(),
    sort: faker.random.number(),
    tags: [],
    todo: todoGenerator(),
    totalPackageQuantity: faker.random.number(),
    totalQuantity: faker.random.number(),
    totalVolume: {
      value: faker.random.number(),
      metric: 'm',
    },
    totalWeight: {
      value: faker.random.number(),
      metric: 'kg',
    },
    updatedAt: faker.date.future(),
    warehouseArrivalActualDateAssignedTo: [],
    warehouseArrivalAgreedDateAssignedTo: [],
  };
};
