// @flow

export function getCache<T>(prefix: string, key: string): T | null {
  const result = window.localStorage.getItem(`${prefix}_${key}`);
  if (!result) {
    return null;
  }

  try {
    return JSON.parse(atob(result));
  } catch (e) {
    return null;
  }
}

export function setCache<T>(prefix: string, key: string, value: T) {
  // $FlowFixMe
  window.localStorage.setItem(`${prefix}_${key}`, btoa(JSON.stringify(value)));
}

export function invalidateCache(prefix: string) {
  const cacheKeys = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < window.localStorage.length; i++) {
    if (window.localStorage.key(i).indexOf(prefix) === 0) {
      cacheKeys.push(window.localStorage.key(i));
    }
  }

  cacheKeys.forEach(key => window.localStorage.removeItem(key));
}
