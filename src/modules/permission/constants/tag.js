export const TAG_LIST = 'tag.tags.list';
export const TAG_GET = 'tag.tags.get';
export const TAG_CREATE = 'tag.tags.create';
export const TAG_UPDATE = 'tag.tags.update';

const tag = {
  default: [TAG_LIST, TAG_GET],
  manager: [TAG_LIST, TAG_GET, TAG_CREATE, TAG_UPDATE],
};

export default tag;
