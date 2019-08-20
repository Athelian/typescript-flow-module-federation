// @flow
import { range } from 'lodash';
import faker from 'faker';
import type {
  Project,
  User,
  Organization,
  TaskCount,
  Milestone,
  Timeline,
} from 'generated/graphql';

const baseUserMock = (): User => {
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

const baseGroupMock = (): Organization => {
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

const baseTaskCountMock = (): TaskCount => {
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

const baseTimelineMock = (): Timeline => {
  return {
    unreadCount: 0,
    entries: {
      nodes: [],
      hits: [],
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

const baseMilestoneMock = (): Milestone => {
  return {
    id: faker.random.uuid(),
    project: {
      id: faker.random.uuid(),
      name: faker.name.firstName(),
      description: faker.lorem.paragraph(),
      ownedBy: baseGroupMock(),
      tags: [],
      createdAt: faker.date.future(),
      updatedAt: faker.date.future(),
      milestones: [],
      timeline: baseTimelineMock(),
      taskCount: baseTaskCountMock(),
      __typename: 'Project',
    },
    name: faker.name.firstName(),
    description: faker.lorem.paragraph(),
    ownedBy: baseGroupMock(),
    tasks: [],
    products: {
      __typename: 'ProductPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    productsRelated: {
      __typename: 'ProductPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    productProviders: {
      __typename: 'ProductProviderPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    productProvidersRelated: {
      __typename: 'ProductProviderPayloadPaginatedSearch',
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
    ordersRelated: {
      __typename: 'OrderPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
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
    orderItemsRelated: {
      __typename: 'OrderItemPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
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
    batchesRelated: {
      __typename: 'BatchPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
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
    shipmentsRelated: {
      __typename: 'ShipmentPayloadPaginatedSearch',
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
    containersRelated: {
      __typename: 'ContainerPayloadPaginatedSearch',
      nodes: [],
      hits: [],
      page: 0,
      perPage: 0,
      totalPage: 0,
      count: 0,
      totalCount: 0,
    },
    sort: 0,
    entitiesCount: {
      __typename: 'MilestoneEntitiesCount',
      products: 0,
      productProviders: 0,
      orders: 0,
      orderItems: 0,
      batches: 0,
      shipments: 0,
      containers: 0,
    },
    entitiesRelatedCount: {
      __typename: 'MilestoneEntitiesCount',
      products: 0,
      productProviders: 0,
      orders: 0,
      orderItems: 0,
      batches: 0,
      shipments: 0,
      containers: 0,
    },
    taskCount: baseTaskCountMock(),
    createdAt: faker.date.future(),
    updatedAt: faker.date.future(),
    __typename: 'Milestone',
  };
};

const baseProjectMock = (): Project => {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    description: faker.lorem.paragraph(),
    ownedBy: baseGroupMock(),
    tags: [],
    createdAt: faker.date.future(),
    updatedAt: faker.date.future(),
    milestones: range(5).map(baseMilestoneMock),
    timeline: baseTimelineMock(),
    taskCount: baseTaskCountMock(),
    __typename: 'Project',
  };
};

const usersMock: Array<User> = range(10).map(baseUserMock);
const projectsMock: Array<Project> = range(10).map(baseProjectMock);

export const mocks = {
  User: () => {
    return baseUserMock();
  },
  Organization: () => {
    return baseGroupMock();
  },
  Project: () => {
    return baseProjectMock();
  },
  Timeline: () => {
    return baseTimelineMock();
  },
  DateTime: () => {
    return new Date();
  },
  UserPayloadPagination: () => {
    return {
      nodes: usersMock,
      page: 1,
      totalPage: 1,
    };
  },
  ProjectPayloadPagination: () => {
    return {
      nodes: projectsMock,
      page: 1,
      totalPage: 1,
    };
  },
};

export default mocks;
