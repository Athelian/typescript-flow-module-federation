export const TEMPLATE_LIST = 'relationMap.maskEdits.list';
export const TEMPLATE_GET = 'relationMap.maskEdits.get';
export const TEMPLATE_CREATE = 'relationMap.maskEdits.create';
export const TEMPLATE_UPDATE = 'relationMap.maskEdits.update';

const template = {
  default: [TEMPLATE_LIST, TEMPLATE_GET],
  manager: [TEMPLATE_LIST, TEMPLATE_GET, TEMPLATE_CREATE, TEMPLATE_UPDATE],
};

export default template;
