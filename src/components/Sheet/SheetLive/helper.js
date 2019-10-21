// @flow

export const convertEntityToInput = (id: string, type: string): Object => {
  switch (type) {
    case 'Product':
      return {
        productId: id,
      };
    case 'ProductProvider':
      return {
        productProviderId: id,
      };
    case 'Order':
      return {
        orderId: id,
      };
    case 'OrderItem':
      return {
        orderItemId: id,
      };
    case 'Batch':
      return {
        batchId: id,
      };
    case 'Shipment':
      return {
        shipmentId: id,
      };
    case 'Container':
      return {
        containerId: id,
      };
    case 'TimelineDate':
      return {
        timelineDateId: id,
      };
    case 'Project':
      return {
        projectId: id,
      };
    case 'Milestone':
      return {
        milestoneId: id,
      };
    case 'Task':
      return {
        taskId: id,
      };
    default:
      throw new Error('unsupported entity type');
  }
};

export default convertEntityToInput;
