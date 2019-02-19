export const STAFF_LIST = 'network.users.list';
export const STAFF_GET = 'network.users.get';

const staff = {
  default: [STAFF_LIST, STAFF_GET],
  manager: [STAFF_LIST, STAFF_GET],
};

export default staff;
