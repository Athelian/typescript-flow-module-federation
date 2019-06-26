// @flow
const SALT = 'zenport';

export const encodeId = (id: string) => {
  try {
    return encodeURIComponent(btoa(`${SALT}${id}`).replace(/=/g, ''));
  } catch (error) {
    return '';
  }
};

export const decodeId = (id: string) => {
  try {
    return atob(decodeURIComponent(id)).replace(SALT, '');
  } catch (error) {
    return '';
  }
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function injectUid(obj: Object) {
  const id = `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  return { id, ...obj };
}

export function uuid(): string {
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
