// @flow
const SALT = 'zenport';

export const encodeId = (id: string) => encodeURIComponent(btoa(`${SALT}${id}`).replace(/=/g, ''));

export const decodeId = (id: string) => atob(decodeURIComponent(id)).replace(SALT, '');
