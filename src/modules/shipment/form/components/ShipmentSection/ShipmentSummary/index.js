// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { groupBy } from 'lodash';
import { Subscribe } from 'unstated';
import { getByPathWithDefault, isNullOrUndefined, getByPath } from 'utils/fp';
import { findBatchQuantity, findVolume, findWeight, totalBatchPriceAmount } from 'utils/batch';
import { getPortName } from 'utils/shipment';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import {
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentBatchesContainer,
  ShipmentFilesContainer,
  ShipmentTasksContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import { SummaryStyle } from './style';

const ShipmentSummary = () => {
  return (
    <Subscribe
      to={[
        ShipmentTransportTypeContainer,
        ShipmentTimelineContainer,
        ShipmentContainersContainer,
        ShipmentBatchesContainer,
        ShipmentFilesContainer,
        ShipmentTasksContainer,
      ]}
    >
      {(
        { state: { transportType } },
        { state: shipmentTimelineState },
        { state: { containers } },
        { state: { batches } },
        { state: { files } },
        {
          state: {
            todo: { tasks = [] },
          },
        }
      ) => {
        const { voyages = [] } = shipmentTimelineState;

        const correctPort = transportType === 'Sea' ? 'seaport' : 'airport';
        const transportTypeEnum = transportType === 'Sea' ? 'Seaport' : 'Airport';
        const loadPort = getByPathWithDefault(
          '',
          `voyages.0.departurePort.${correctPort}`,
          shipmentTimelineState
        );
        const dischargePort = getByPathWithDefault(
          '',
          `voyages.${voyages.length - 1}.arrivalPort.${correctPort}`,
          shipmentTimelineState
        );

        const lastVessel = getByPathWithDefault(
          'N/A',
          `voyages.${voyages.length - 1}.vesselName`,
          shipmentTimelineState
        );

        const totalBatchQuantity = batches.reduce(
          (total, batch) => total + findBatchQuantity(batch),
          0
        );

        const currency = getByPath('0.orderItem.price.currency', batches);
        let totalPrice = 0;
        for (let i = 0; i < batches.length; i += 1) {
          const validPrice =
            i === 0
              ? true
              : getByPath('orderItem.price.currency', batches[i]) ===
                getByPath('orderItem.price.currency', batches[i - 1]);

          if (!validPrice) {
            totalPrice = 'Invalid';
            break;
          }
          totalPrice += totalBatchPriceAmount(batches[i]);
        }

        const productSet = new Set();
        const orderSet = new Set();
        let totalWeightValue = 0;
        let totalVolumeValue = 0;

        batches.forEach(batch => {
          const productId = getByPath('orderItem.productProvider.product.id', batch);
          if (productId) {
            productSet.add(productId);
          }
          const orderId = getByPath('orderItem.order.id', batch);
          if (orderId) {
            orderSet.add(orderId);
          }
          totalWeightValue += findWeight(batch);
          totalVolumeValue += findVolume(batch);
        });

        const containerTypes = groupBy(containers, 'containerType');

        const tasksPending = tasks.filter(item => isNullOrUndefined(item.inProgressAt)).length;
        const tasksInProgress = tasks.filter(
          item => !isNullOrUndefined(item.inProgressAt) && isNullOrUndefined(item.completedAt)
        ).length;
        const tasksCompleted = tasks.filter(item => !isNullOrUndefined(item.completedAt)).length;
        const tasksApproved = tasks.filter(item => !isNullOrUndefined(item.approvedAt)).length;
        const tasksRejected = tasks.filter(item => !isNullOrUndefined(item.rejectedAt)).length;

        return (
          <div className={SummaryStyle}>
            <GridColumn>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.loadPort" defaultMessage="LOAD PORT" />
                  </Label>
                }
                input={<Display>{getPortName(transportTypeEnum, loadPort)}</Display>}
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.dischargePort"
                      defaultMessage="DISCHARGE PORT"
                    />
                  </Label>
                }
                input={<Display>{getPortName(transportTypeEnum, dischargePort)}</Display>}
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.latestVessel"
                      defaultMessage="LATEST VESSEL"
                    />
                  </Label>
                }
                input={<Display>{lastVessel}</Display>}
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.voyages" defaultMessage="VOYAGES" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={voyages.length} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.batchedQuantity"
                      defaultMessage="BATCHED QUANTITY"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalBatchQuantity} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.totalPrice"
                      defaultMessage="TOTAL PRICE"
                    />
                  </Label>
                }
                input={
                  totalPrice === 'Invalid' ? (
                    <Tooltip
                      message={
                        <FormattedMessage
                          id="modules.shipment.totalPriceInvalidMessage"
                          defaultMessage="Cannot compute this field because this Shipment contains Cargo with different Currencies"
                        />
                      }
                    >
                      <div>
                        <FormattedMessage id="modules.shipment.invalid" defaultMessage="Invalid" />
                      </div>
                    </Tooltip>
                  ) : (
                    <Display>
                      <FormattedNumber value={totalPrice} prefix={currency} />
                    </Display>
                  )
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.products" defaultMessage="PRODUCTS" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={productSet.size} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.orders" defaultMessage="ORDERS" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={orderSet.size} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.batches" defaultMessage="BATCHES" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={batches && batches.length} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.weight" defaultMessage="WEIGHT" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalWeightValue} suffix="kg" />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.volume" defaultMessage="VOLUME" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={totalVolumeValue} suffix="m³" />
                  </Display>
                }
              />
            </GridColumn>
            <GridColumn>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.documents" defaultMessage="DOCUMENTS" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={files && files.length} />
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.containers"
                      defaultMessage="CONTAINERS"
                    />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={containers && containers.length} />
                  </Display>
                }
              />
              <div>
                {Object.entries(containerTypes).map(([key, value]) => {
                  const label = new Map(
                    CONTAINER_TYPE_ITEMS.map(item => [item.value, item.label])
                  ).get(key);
                  if (label)
                    return (
                      <FieldItem
                        key={key}
                        label={<Display>{label}</Display>}
                        input={
                          <Display>
                            <FormattedNumber value={Array.isArray(value) ? value.length : 0} />
                          </Display>
                        }
                      />
                    );
                  return null;
                })}
              </div>
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage id="modules.shipment.tasks" defaultMessage="TASKS" />
                  </Label>
                }
                input={
                  <Display>
                    <FormattedNumber value={tasks && tasks.length} />
                  </Display>
                }
              />
              <div>
                <FieldItem
                  label="Pending"
                  input={
                    <Display>
                      <FormattedNumber value={tasksPending} />
                    </Display>
                  }
                />
                <FieldItem
                  label="In Progress"
                  input={
                    <Display>
                      <FormattedNumber value={tasksInProgress} />
                    </Display>
                  }
                />
                <FieldItem
                  label="Completed"
                  input={
                    <Display>
                      <FormattedNumber value={tasksCompleted} />
                    </Display>
                  }
                />
                <FieldItem
                  label="Approved"
                  input={
                    <Display>
                      <FormattedNumber value={tasksApproved} />
                    </Display>
                  }
                />
                <FieldItem
                  label="Rejected"
                  input={
                    <Display>
                      <FormattedNumber value={tasksRejected} />
                    </Display>
                  }
                />
              </div>
            </GridColumn>
          </div>
        );
      }}
    </Subscribe>
  );
};

export default ShipmentSummary;
