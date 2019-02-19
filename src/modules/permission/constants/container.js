export const CONTAINER_LIST = 'container.containers.list';
export const CONTAINER_GET = 'container.containers.get';
export const CONTAINER_CREATE = 'container.containers.create';
export const CONTAINER_UPDATE = 'container.containers.update';

const container = {
  default: [CONTAINER_LIST, CONTAINER_GET],
  manager: [CONTAINER_LIST, CONTAINER_GET, CONTAINER_CREATE, CONTAINER_UPDATE],
};

export default container;
