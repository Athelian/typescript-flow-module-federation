export const createMutationRequest = client => async (mutationData, refId) =>
  new Promise(resolve => {
    client.mutate(mutationData).then(result => {
      resolve({ data: result.data, refId });
    });
  });

export const getDefaultResult = () => ({
  order: [],
  shipment: [],
  orderItem: {},
  batch: {},
});

export const getDefaultFocus = () => ({
  order: {},
  orderItem: {},
  shipment: {},
  batch: {},
});
