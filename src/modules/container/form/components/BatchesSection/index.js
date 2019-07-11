// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { isNullOrUndefined } from 'utils/fp';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import { SectionHeader, SectionWrapper } from 'components/Form';
import SelectShipmentBatches from 'components/SelectShipmentBatches';
import {
  calculatePackageQuantity,
  generateCloneBatch,
  generateBatchByOrderItem,
} from 'utils/batch';
import {
  CONTAINER_UPDATE,
  CONTAINER_BATCHES_ADD,
  CONTAINER_BATCHES_REMOVE,
  CONTAINER_BATCHES_LIST,
} from 'modules/permission/constants/container';
import { SHIPMENT_FORM, SHIPMENT_REMOVE_BATCH } from 'modules/permission/constants/shipment';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_LIST, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  BATCH_CREATE,
  BATCH_LIST,
  BATCH_FORM,
  BATCH_UPDATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_TASK_LIST,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { SectionNavBar } from 'components/NavBar';
import { ContainerBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { ContainerBatchesContainer } from 'modules/container/form/containers';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import SelectOrderItems from 'providers/SelectOrderItems';
import { HIDE, NAVIGABLE } from 'modules/batch/constants';

import {
  BatchesSectionWrapperStyle,
  BatchesSectionBodyStyle,
  BatchesGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

type OptionalProps = {
  exporterId: string,
};

type Props = OptionalProps & {
  containerIsArchived: boolean,
  isSlideView: boolean,
  importerId: string,
};

function BatchesSection({ containerIsArchived, isSlideView, importerId, exporterId }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(CONTAINER_BATCHES_LIST)) return null;

  const allowUpdate = hasPermission(CONTAINER_UPDATE);

  const allowAddBatches =
    hasPermission(BATCH_LIST) && (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));

  const allowCreateBatches =
    hasPermission(BATCH_CREATE) &&
    hasPermission(ORDER_ITEMS_LIST) &&
    (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));

  const allowCloneBatches =
    hasPermission(BATCH_CREATE) && (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));

  const allowRemoveBatches =
    allowUpdate ||
    (hasPermission(CONTAINER_BATCHES_REMOVE) && hasPermission(SHIPMENT_REMOVE_BATCH));

  if (!hasPermission(CONTAINER_BATCHES_LIST)) return null;

  return (
    <SectionWrapper id="container_batchesSection">
      <Subscribe to={[ContainerBatchesContainer]}>
        {({
          state: { batches = [], representativeBatch },
          setFieldValue,
          setDeepFieldValue,
          addExistingBatches,
          removeExistingBatch,
        }) => (
          <>
            <SectionHeader
              icon="BATCH"
              title={
                <>
                  <FormattedMessage id="modules.container.batches" defaultMessage="BATCHES" /> (
                  <FormattedNumber value={batches.length} />)
                </>
              }
            />

            <div className={BatchesSectionWrapperStyle}>
              <SectionNavBar>
                {allowAddBatches && (
                  <BooleanValue>
                    {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
                      <>
                        {importerId.length === 0 ? (
                          <Tooltip
                            message={
                              <FormattedMessage
                                id="modules.Containers.chooseShipmentImporterFirst"
                                defaultMessage="Please select an Importer in the Shipment first"
                              />
                            }
                          >
                            <div>
                              <NewButton
                                data-testid="btnSelectBatches"
                                label={
                                  <FormattedMessage
                                    id="modules.Shipments.selectBatches"
                                    defaultMessage="SELECT BATCHES"
                                  />
                                }
                                disabled
                                onClick={() => selectBatchesSlideToggle(true)}
                              />
                            </div>
                          </Tooltip>
                        ) : (
                          <NewButton
                            data-testid="btnSelectBatches"
                            label={
                              <FormattedMessage
                                id="modules.Shipments.selectBatches"
                                defaultMessage="SELECT BATCHES"
                              />
                            }
                            onClick={() => selectBatchesSlideToggle(true)}
                          />
                        )}
                        <SlideView
                          isOpen={selectBatchesIsOpen}
                          onRequestClose={() => selectBatchesSlideToggle(false)}
                        >
                          {selectBatchesIsOpen && (
                            <SelectShipmentBatches
                              cacheKey="ContainerSelectBatches"
                              filter={{
                                importerId,
                                ...(exporterId ? { exporterId } : {}),
                              }}
                              selectedBatches={batches}
                              onSelect={selected => {
                                const selectedBatches = selected.map(selectedBatch => ({
                                  ...selectedBatch,
                                  packageQuantity: calculatePackageQuantity(selectedBatch),
                                }));
                                if (batches.length === 0 && selectedBatches.length > 0) {
                                  setFieldValue('representativeBatch', selectedBatches[0]);
                                }
                                setFieldValue('batches', [...batches, ...selectedBatches]);
                                addExistingBatches(selectedBatches);

                                selectBatchesSlideToggle(false);
                              }}
                              onCancel={() => selectBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}
                {allowCreateBatches && (
                  <BooleanValue>
                    {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
                      <>
                        {importerId.length === 0 ? (
                          <Tooltip
                            message={
                              <FormattedMessage
                                id="modules.Containers.chooseShipmentImporterFirst"
                                defaultMessage="Please select an Importer in the Shipment first"
                              />
                            }
                          >
                            <div>
                              <NewButton
                                label={
                                  <FormattedMessage
                                    id="modules.Shipments.newBatch"
                                    defaultMessage="NEW BATCH"
                                  />
                                }
                                disabled
                                onClick={() => createBatchesSlideToggle(true)}
                              />
                            </div>
                          </Tooltip>
                        ) : (
                          <NewButton
                            label={
                              <FormattedMessage
                                id="modules.Shipments.newBatch"
                                defaultMessage="NEW BATCH"
                              />
                            }
                            onClick={() => createBatchesSlideToggle(true)}
                          />
                        )}
                        <SlideView
                          isOpen={createBatchesIsOpen}
                          onRequestClose={() => createBatchesSlideToggle(false)}
                        >
                          {createBatchesIsOpen && (
                            <SelectOrderItems
                              filter={{
                                importerId,
                                ...(exporterId ? { exporterId } : {}),
                              }}
                              onSelect={selectedOrderItems => {
                                const createdBatches = selectedOrderItems.map(
                                  (orderItem, counter) => ({
                                    ...generateBatchByOrderItem(orderItem),
                                    orderItem,
                                    no: `batch no ${batches.length + counter + 1}`,
                                    archived: orderItem.archived && containerIsArchived,
                                  })
                                );
                                if (batches.length === 0 && createdBatches.length > 0) {
                                  setFieldValue('representativeBatch', createdBatches[0]);
                                }
                                setFieldValue('batches', [...batches, ...createdBatches]);
                                createBatchesSlideToggle(false);
                              }}
                              onCancel={() => createBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}
              </SectionNavBar>
              <div className={BatchesSectionBodyStyle}>
                {(() => {
                  if (batches.length === 0) {
                    return (
                      <div className={EmptyMessageStyle}>
                        <FormattedMessage
                          id="modules.container.noBatches"
                          defaultMessage="No batches found"
                        />
                      </div>
                    );
                  }

                  // FIXME: Try to fix the representativeBatch without set state on rendering UI
                  if (isNullOrUndefined(representativeBatch)) {
                    setDeepFieldValue('representativeBatch', batches[0]);
                  }

                  return (
                    <div className={BatchesGridStyle}>
                      {batches.map((batch, position) => (
                        <BooleanValue key={batch.id}>
                          {({ value: opened, set: batchSlideToggle }) => (
                            <>
                              <SlideView
                                isOpen={opened}
                                onRequestClose={() => batchSlideToggle(false)}
                              >
                                {opened && (
                                  <BatchFormInSlide
                                    batch={batch}
                                    onSave={value => {
                                      batchSlideToggle(false);
                                      setDeepFieldValue(`batches.${position}`, value);
                                    }}
                                    itemConfig={NAVIGABLE}
                                    shipmentConfig={isSlideView ? HIDE : NAVIGABLE}
                                    containerConfig={HIDE}
                                    orderConfig={NAVIGABLE}
                                  />
                                )}
                              </SlideView>
                              <div className={ItemStyle}>
                                <ContainerBatchCard
                                  editable={{
                                    no: hasPermission([BATCH_UPDATE, BATCH_SET_NO]),
                                    quantity: hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY]),
                                    deliveredAt: hasPermission([
                                      BATCH_UPDATE,
                                      BATCH_SET_DELIVERY_DATE,
                                    ]),
                                    desiredAt: hasPermission([
                                      BATCH_UPDATE,
                                      BATCH_SET_DESIRED_DATE,
                                    ]),
                                    representativeBatch: hasPermission([
                                      CONTAINER_UPDATE,
                                      CONTAINER_BATCHES_ADD,
                                      CONTAINER_BATCHES_REMOVE,
                                    ]),
                                    removeBatch: allowRemoveBatches,
                                    cloneBatch: allowCloneBatches,
                                  }}
                                  viewable={{
                                    price: hasPermission(ORDER_ITEMS_GET_PRICE),
                                    tasks: hasPermission(BATCH_TASK_LIST),
                                  }}
                                  navigable={{
                                    product: hasPermission(PRODUCT_FORM),
                                    order: hasPermission(ORDER_FORM),
                                    shipment: hasPermission(SHIPMENT_FORM),
                                  }}
                                  batch={batch}
                                  saveOnBlur={updatedBatch => {
                                    setDeepFieldValue(`batches.${position}`, updatedBatch);
                                  }}
                                  isRepresented={
                                    !isNullOrUndefined(representativeBatch) &&
                                    representativeBatch.id === batch.id
                                  }
                                  onClickRepresentative={() =>
                                    setDeepFieldValue(`representativeBatch`, batch)
                                  }
                                  onClick={
                                    hasPermission(BATCH_FORM)
                                      ? () => batchSlideToggle(true)
                                      : () => {}
                                  }
                                  onClear={({ id }) => {
                                    const newBatches = batches.filter(
                                      ({ id: batchId }) => id !== batchId
                                    );
                                    setFieldValue('batches', newBatches);
                                    removeExistingBatch(id);
                                    if (id === representativeBatch.id) {
                                      if (newBatches.length > 0) {
                                        setDeepFieldValue('representativeBatch', newBatches[0]);
                                      } else {
                                        setDeepFieldValue('representativeBatch', null);
                                      }
                                    }
                                  }}
                                  onClone={value => {
                                    const clonedBatch = generateCloneBatch(value, hasPermission);
                                    setFieldValue('batches', [...batches, clonedBatch]);
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </BooleanValue>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </Subscribe>
    </SectionWrapper>
  );
}

export default BatchesSection;
