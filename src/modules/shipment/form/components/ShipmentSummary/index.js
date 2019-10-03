// @flow
import * as React from 'react';
import type { TaskCount } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import ContentLoader from 'react-content-loader';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import { calculateTasks } from 'utils/task';
import { getBatchLatestQuantity, findVolume, findWeight, totalBatchPriceAmount } from 'utils/batch';
import { getPortName } from 'utils/shipment';
import GridColumn from 'components/GridColumn';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import { FieldItem, Label, Display, NumberInputFactory, MetricInputFactory } from 'components/Form';
import { FormField } from 'modules/form';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import {
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentBatchesContainer,
  ShipmentFilesContainer,
  ShipmentTasksContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY,
  SHIPMENT_SET_TOTAL_VOLUME,
  SHIPMENT_SET_TOTAL_WEIGHT,
} from 'modules/permission/constants/shipment';
import {
  SummaryStyle,
  ContainerTypesWrapperStyle,
  TasksWrapperStyle,
  TaskIconStyle,
} from './style';
import { shipmentFormSummaryQuery } from './query';

type Props = {|
  entityId: string,
  isLoading: boolean,
  isNewOrClone: boolean,
|};

const defaultVolume = {
  value: 0,
  metric: 'm³',
};

const defaultWeight = {
  value: 0,
  metric: 'kg',
};

const CustomPlaceHolder = () => (
  <ContentLoader height={460} width={680} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="25" y="16" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="59" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="101" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="141" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="182" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="229" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="270" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="312" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="347" rx="5" ry="5" width="290" height="20" />
    <rect x="25" y="392" rx="5" ry="5" width="290" height="20" />
    <rect x="350" y="17" rx="5" ry="5" width="290" height="20" />
    <rect x="350" y="58" rx="5" ry="5" width="290" height="20" />
    <rect x="350" y="98" rx="5" ry="5" width="290" height="20" />
    <rect x="350" y="141" rx="5" ry="5" width="290" height="20" />
  </ContentLoader>
);

const ShipmentSummary = ({ entityId, isLoading, isNewOrClone }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canUpdate = hasPermission(SHIPMENT_UPDATE);

  return (
    <QueryPlaceHolder
      PlaceHolder={CustomPlaceHolder}
      query={shipmentFormSummaryQuery}
      entityId={entityId}
      isLoading={isLoading}
    >
      {({ data }) => {
        return (
          <Subscribe
            to={[
              ShipmentInfoContainer,
              ShipmentTransportTypeContainer,
              ShipmentTimelineContainer,
              ShipmentContainersContainer,
              ShipmentBatchesContainer,
              ShipmentFilesContainer,
              ShipmentTasksContainer,
            ]}
          >
            {(
              {
                state: baseValues,
                originalValues: baseOriginalValues,
                setFieldValue,
                setFieldValues,
              },
              { state: { transportType } },
              { state: { voyages: voyagesState = [], hasCalledTimelineApiYet } },
              { state: { containers = [], hasCalledContainerApiYet } },
              { state: { batches: batchesState = [], hasCalledBatchesApiYet } },
              { state: { files: filesState = [], hasCalledFilesApiYet } },
              { state: { todo: todoState, hasCalledTasksApiYet } }
            ) => {
              const correctPort = transportType === 'Sea' ? 'seaport' : 'airport';
              const transportTypeEnum = transportType === 'Sea' ? 'Seaport' : 'Airport';
              const voyages =
                hasCalledTimelineApiYet || isNewOrClone
                  ? voyagesState
                  : getByPathWithDefault([], 'shipment.voyages', data);
              const loadPort = getByPathWithDefault('', `0.departurePort.${correctPort}`, voyages);
              const dischargePort = getByPathWithDefault(
                '',
                `${voyages.length - 1}.arrivalPort.${correctPort}`,
                voyages
              );

              const lastVessel = getByPathWithDefault(
                null,
                `${voyages.length - 1}.vesselName`,
                voyages
              );

              const batches =
                hasCalledBatchesApiYet || isNewOrClone
                  ? batchesState
                  : getByPathWithDefault([], 'shipment.batches', data);

              const totalBatchQuantity =
                hasCalledBatchesApiYet || isNewOrClone
                  ? batches.reduce((total, batch) => total + getBatchLatestQuantity(batch), 0)
                  : batches.reduce((total, batch) => total + batch.latestQuantity, 0);

              const totalPackageQuantity =
                hasCalledBatchesApiYet || isNewOrClone
                  ? batches.reduce(
                      (total, batch) => total + getByPathWithDefault(0, 'packageQuantity', batch),
                      0
                    )
                  : getByPathWithDefault(0, 'shipment.totalPackageQuantity', data);

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

              if (!hasCalledBatchesApiYet && !isNewOrClone) {
                totalVolumeValue = getByPathWithDefault(0, 'shipment.totalVolume.value', data);
              }

              const totalOrder =
                hasCalledBatchesApiYet || isNewOrClone
                  ? orderSet.size
                  : getByPathWithDefault(0, 'shipment.orderCount', data);

              const containerTypes =
                hasCalledContainerApiYet || isNewOrClone
                  ? CONTAINER_TYPE_ITEMS.map(containerType => {
                      return { ...containerType, count: 0 };
                    })
                  : getByPathWithDefault([], 'shipment.containerTypeCounts', data).map(item => ({
                      ...item,
                      ...CONTAINER_TYPE_ITEMS.find(type => type.value === item.containerType),
                    }));

              const totalContainer =
                hasCalledContainerApiYet || isNewOrClone
                  ? containers.length
                  : getByPathWithDefault([], 'shipment.containers', data).length;
              if (hasCalledContainerApiYet) {
                containers.forEach(({ containerType }) => {
                  if (containerType) {
                    const foundType = containerTypes.find(({ value }) => value === containerType);
                    if (foundType) {
                      foundType.count += 1;
                    }
                  }
                });
              }

              const files =
                hasCalledFilesApiYet || isNewOrClone
                  ? filesState
                  : getByPathWithDefault([], 'shipment.files', data);

              const taskCount: TaskCount =
                hasCalledTasksApiYet || isNewOrClone
                  ? calculateTasks(todoState.tasks)
                  : getByPathWithDefault(
                      {
                        approved: 0,
                        completed: 0,
                        count: 0,
                        delayed: 0,
                        inProgress: 0,
                        rejected: 0,
                        remain: 0,
                        skipped: 0,
                      },
                      'shipment.todo.taskCount',
                      data
                    );

              const calculateTotalWeight =
                { value: totalWeightValue, metric: 'kg' } || defaultWeight;
              const calculateTotalVolume =
                { value: totalVolumeValue, metric: 'm³' } || defaultVolume;

              const values = {
                totalPackageQuantityOverride: baseValues.totalPackageQuantityOverriding
                  ? totalPackageQuantity
                  : baseValues.totalPackageQuantityOverride,
                totalPackageQuantityOverriding: baseValues.totalPackageQuantityOverriding,
                totalWeightOverride: baseValues.totalWeightOverriding
                  ? calculateTotalWeight
                  : baseValues.totalWeightOverride,
                totalWeightOverriding: baseValues.totalWeightOverriding,
                totalVolumeOverride: baseValues.totalVolumeOverriding
                  ? calculateTotalVolume
                  : baseValues.totalVolumeOverride,
                totalVolumeOverriding: baseValues.totalVolumeOverriding,
              };

              return (
                <div className={SummaryStyle}>
                  <GridColumn>
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage
                            id="modules.Shipments.loadPort"
                            defaultMessage="LOAD PORT"
                          />
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
                            id="modules.Shipments.dischargePort"
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
                            id="modules.Shipments.latestVessel"
                            defaultMessage="LAST VESSEL"
                          />
                        </Label>
                      }
                      input={
                        <Display>
                          {lastVessel || <FormattedMessage id="components.cards.na" />}
                        </Display>
                      }
                    />
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage
                            id="modules.Shipments.voyages"
                            defaultMessage="VOYAGES"
                          />
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
                            id="modules.Shipments.batchedQuantity"
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
                            id="modules.Shipments.totalPrice"
                            defaultMessage="TOTAL PRICE"
                          />
                        </Label>
                      }
                      input={
                        totalPrice === 'Invalid' ? (
                          <Tooltip
                            message={
                              <FormattedMessage
                                id="modules.Shipments.totalPriceInvalidMessage"
                                defaultMessage="Cannot compute this field because this Shipment contains Cargo with different Currencies"
                              />
                            }
                          >
                            <div>
                              <Display>
                                <FormattedMessage
                                  id="modules.Shipments.invalid"
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
                          <FormattedMessage
                            id="modules.Shipments.products"
                            defaultMessage="PRODUCTS"
                          />
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
                          <FormattedMessage id="modules.Shipments.orders" defaultMessage="ORDERS" />
                        </Label>
                      }
                      input={
                        <Display>
                          <FormattedNumber value={totalOrder} />
                        </Display>
                      }
                    />
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage
                            id="modules.Shipments.batches"
                            defaultMessage="Batches"
                          />
                        </Label>
                      }
                      input={
                        <Display>
                          <FormattedNumber value={batches && batches.length} />
                        </Display>
                      }
                    />
                    <FormField
                      name="totalPackageQuantityOverride"
                      initValue={values.totalPackageQuantityOverride}
                      setFieldValue={setFieldValue}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          inputWidth="150px"
                          labelWidth="150px"
                          name={name}
                          {...inputHandlers}
                          originalValue={baseOriginalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Shipments.totalPackages"
                              defaultMessage="Total Packages"
                            />
                          }
                          editable={canUpdate || hasPermission(SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY)}
                          showExtraToggleButton={
                            canUpdate || hasPermission(SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY)
                          }
                          hideTooltip={values.totalPackageQuantityOverriding}
                          autoCalculateIsToggled={values.totalPackageQuantityOverriding}
                          onToggleAutoCalculate={() => {
                            if (values.totalPackageQuantityOverriding) {
                              setFieldValues({
                                totalPackageQuantityOverriding: false,
                                totalPackageQuantityOverride: totalPackageQuantity,
                              });
                            } else {
                              setFieldValues({
                                totalPackageQuantityOverriding: true,
                                totalPackageQuantityOverride: 0,
                              });
                            }
                          }}
                        />
                      )}
                    </FormField>
                    <FormField
                      name="totalWeightOverride"
                      initValue={values.totalWeightOverride}
                      setFieldValue={setFieldValue}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <MetricInputFactory
                          inputWidth="150px"
                          labelWidth="150px"
                          metricType="weight"
                          name={name}
                          {...inputHandlers}
                          originalValue={baseOriginalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Shipments.weight"
                              defaultMessage="WEIGHT"
                            />
                          }
                          editable={canUpdate || hasPermission(SHIPMENT_SET_TOTAL_WEIGHT)}
                          showExtraToggleButton={
                            canUpdate || hasPermission(SHIPMENT_SET_TOTAL_WEIGHT)
                          }
                          hideTooltip={values.totalWeightOverriding}
                          autoCalculateIsToggled={values.totalWeightOverriding}
                          onToggleAutoCalculate={() => {
                            if (values.totalWeightOverriding) {
                              setFieldValues({
                                totalWeightOverriding: false,
                                totalWeightOverride: calculateTotalWeight,
                              });
                            } else {
                              setFieldValues({
                                totalWeightOverriding: true,
                                totalWeightOverride: defaultWeight,
                              });
                            }
                          }}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="totalVolumeOverride"
                      initValue={values.totalVolumeOverride}
                      setFieldValue={setFieldValue}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <MetricInputFactory
                          inputWidth="150px"
                          labelWidth="150px"
                          metricType="volume"
                          name={name}
                          {...inputHandlers}
                          originalValue={baseOriginalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Shipments.volume"
                              defaultMessage="VOLUME"
                            />
                          }
                          editable={canUpdate || hasPermission(SHIPMENT_SET_TOTAL_VOLUME)}
                          showExtraToggleButton={
                            canUpdate || hasPermission(SHIPMENT_SET_TOTAL_VOLUME)
                          }
                          hideTooltip={values.totalVolumeOverriding}
                          autoCalculateIsToggled={values.totalVolumeOverriding}
                          onToggleAutoCalculate={() => {
                            if (values.totalVolumeOverriding) {
                              setFieldValues({
                                totalVolumeOverriding: false,
                                totalVolumeOverride: calculateTotalVolume,
                              });
                            } else {
                              setFieldValues({
                                totalVolumeOverriding: true,
                                totalVolumeOverride: defaultVolume,
                              });
                            }
                          }}
                        />
                      )}
                    </FormField>
                  </GridColumn>

                  <GridColumn>
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage
                            id="modules.Shipments.documents"
                            defaultMessage="DOCUMENTS"
                          />
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
                              id="modules.Shipments.containers"
                              defaultMessage="CONTAINERS"
                            />
                          </Label>
                        }
                        input={
                          <Display>
                            <FormattedNumber value={totalContainer} />
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
                            <FormattedMessage id="modules.Shipments.tasks" defaultMessage="TASKS" />
                          </Label>
                        }
                        input={
                          <Display>
                            <FormattedNumber value={taskCount.count} />
                          </Display>
                        }
                      />

                      <div className={TasksWrapperStyle}>
                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('TEAL')}>
                                <Icon icon="CHECKED" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.completed"
                                  defaultMessage="COMPLETED"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.completed} />
                            </Display>
                          }
                        />

                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('TEAL')}>
                                <Icon icon="CLOCK" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.inProgress"
                                  defaultMessage="IN PROGRESS"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.inProgress} />
                            </Display>
                          }
                        />

                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('GRAY_SUPER_LIGHT')}>
                                <Icon icon="CHECKED" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.uncompleted"
                                  defaultMessage="UNCOMPLETED"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.remain} />
                            </Display>
                          }
                        />

                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('GRAY_DARK')}>
                                <Icon icon="SKIPPED" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.skipped"
                                  defaultMessage="SKIPPED"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.skipped} />
                            </Display>
                          }
                        />

                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('BLUE')}>
                                <Icon icon="CHECKED" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.approved"
                                  defaultMessage="APPROVED"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.skipped} />
                            </Display>
                          }
                        />

                        <FieldItem
                          label={
                            <>
                              <div className={TaskIconStyle('RED')}>
                                <Icon icon="CANCEL" />
                              </div>
                              <Label>
                                <FormattedMessage
                                  id="modules.Shipments.rejected"
                                  defaultMessage="REJECTED"
                                />
                              </Label>
                            </>
                          }
                          input={
                            <Display>
                              <FormattedNumber value={taskCount.rejected} />
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
      }}
    </QueryPlaceHolder>
  );
};

export default ShipmentSummary;
