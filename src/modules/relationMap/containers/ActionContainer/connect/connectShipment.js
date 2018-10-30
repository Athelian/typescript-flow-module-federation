import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import { updateBatchMutation } from 'modules/batch/form/mutation'
import { getByPathWithDefault as get } from 'utils/fp'

const connectShipmentInBatch = (client, batch, shipmentId) => {
  const batchIds = Object.keys(batch)
  const requests = batchIds.map(batchId => {
    const request = client.mutate({
      mutation: updateBatchMutation,
      variables: {
        id: batchId,
        input: {
          shipmentId
        }
      }
    })
    return request
  })
  return requests
}

export const connectNewShipment = async (client, target) => {
  const { data } = await client.mutate({
    mutation: createShipmentWithReturnDataMutation,
    variables: {
      input: {
        no: `[new] shipment ${Math.random().toPrecision(4)}`,
        containerGroups: [{ warehouseId: '1' }],
        voyages: [{ vesselName: 'new vessel name' }]
      },
    },
  });
  const newShipment = get('', 'shipmentCreate.shipment', data)
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, newShipment.id))
  const result = {
    order: [],
    shipment: [newShipment],
    orderItem: {},
    batch: {}
  }
  const focus = {
    ...target,
    shipment: {
      [newShipment.id]: true
    }
  } 
  return [result, focus]
}

export const connectExistingShipment = async (client, target) => {
  const shipmentIds = Object.keys(target.shipment || {})
  const connectedShipmentId = shipmentIds.length > 0 ? shipmentIds[0] : '' 
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, connectedShipmentId))
  return target
}