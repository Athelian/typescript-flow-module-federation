// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPathWithDefault, isNullOrUndefined, getByPath } from 'utils/fp';
import { getBatchLatestQuantity, findVolume, findWeight, totalBatchPriceAmount } from 'utils/batch';
import { getPortName } from 'utils/shipment';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
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
import {
  SummaryStyle,
  ContainerTypesWrapperStyle,
  TasksWrapperStyle,
  TaskIconStyle,
} from './style';

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
          null,
          `voyages.${voyages.length - 1}.vesselName`,
          shipmentTimelineState
        );

        const totalBatchQuantity = batches.reduce(
          (total, batch) => total + getBatchLatestQuantity(batch),
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

        const containerTypes = CONTAINER_TYPE_ITEMS.map(containerType => {
          return { ...containerType, count: 0 };
        });
        containers.forEach(({ containerType }) => {
          if (containerType) {
            const foundType = containerTypes.find(({ value }) => value === containerType);
            if (foundType) {
              foundType.count += 1;
            }
          }
        });

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
                input={
                  <Display>
                    {getPortName(transportTypeEnum, loadPort) || (
                      <FormattedMessage id="components.cards.na" />
                    )}
                  </Display>
                }
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
                input={
                  <Display>
                    {getPortName(transportTypeEnum, dischargePort) || (
                      <FormattedMessage id="components.cards.na" />
                    )}
                  </Display>
                }
              />
              <FieldItem
                label={
                  <Label>
                    <FormattedMessage
                      id="modules.shipment.latestVessel"
                      defaultMessage="LAST VESSEL"
                    />
                  </Label>
                }
                input={
                  <Display>{lastVessel || <FormattedMessage id="components.cards.na" />}</Display>
                }
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
                        <Display>
                          <FormattedMessage
                            id="modules.shipment.invalid"
                            defaultMessage="Invalid"
                          />
                        </Display>
                      </div>
                    </Tooltip>
                  ) : (
                    <Display>
                      <FormattedNumber value={totalPrice} suffix={currency} />
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

              <GridColumn gap="0">
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

                {containerTypes.some(({ count }) => count > 0) && (
                  <div className={ContainerTypesWrapperStyle}>
                    {containerTypes.map(
                      ({ label, count }) =>
                        count > 0 && (
                          <FieldItem
                            key={label}
                            label={<Label>{label}</Label>}
                            input={
                              <Display>
                                <FormattedNumber value={count} />
                              </Display>
                            }
                          />
                        )
                    )}
                  </div>
                )}
              </GridColumn>

              <GridColumn gap="0">
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

                <div className={TasksWrapperStyle}>
                  <FieldItem
                    label={
                      <>
                        <div className={TaskIconStyle('GRAY_DARK')}>
                          <Icon icon="TASK" />
                        </div>
                        <Label>
                          <FormattedMessage
                            id="modules.shipment.pending"
                            defaultMessage="PENDING"
                          />
                        </Label>
                      </>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={tasksPending} />
                      </Display>
                    }
                  />
                  <FieldItem
                    label={
                      <>
                        <div className={TaskIconStyle('GRAY_DARK')}>
                          <Icon icon="CLOCK" />
                        </div>
                        <Label>
                          <FormattedMessage
                            id="modules.shipment.inProgress"
                            defaultMessage="IN PROGRESS"
                          />
                        </Label>
                      </>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={tasksInProgress} />
                      </Display>
                    }
                  />
                  <FieldItem
                    label={
                      <>
                        <div className={TaskIconStyle('TEAL')}>
                          <Icon icon="CONFIRM" />
                        </div>
                        <Label color="TEAL">
                          <FormattedMessage
                            id="modules.shipment.completed"
                            defaultMessage="COMPLETED"
                          />
                        </Label>
                      </>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={tasksCompleted} />
                      </Display>
                    }
                  />
                  <FieldItem
                    label={
                      <>
                        <div className={TaskIconStyle('BLUE')}>
                          <Icon icon="CHECKED" />
                        </div>
                        <Label color="BLUE">
                          <FormattedMessage
                            id="modules.shipment.approved"
                            defaultMessage="APPROVED"
                          />
                        </Label>
                      </>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={tasksApproved} />
                      </Display>
                    }
                  />
                  <FieldItem
                    label={
                      <>
                        <div className={TaskIconStyle('RED')}>
                          <Icon icon="CANCEL" />
                        </div>
                        <Label color="RED">
                          <FormattedMessage
                            id="modules.shipment.rejected"
                            defaultMessage="REJECTED"
                          />
                        </Label>
                      </>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={tasksRejected} />
                      </Display>
                    }
                  />
                </div>
              </GridColumn>
            </GridColumn>
          </div>
        );
      }}
    </Subscribe>
  );
};

export default ShipmentSummary;
