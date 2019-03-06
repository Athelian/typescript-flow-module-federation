// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectUid } from 'utils/id';
import { isNullOrUndefined } from 'utils/fp';
import { calculatePackageQuantity } from 'utils/batch';
import {
  CONTAINER_UPDATE,
  CONTAINER_BATCHES_ADD,
  CONTAINER_BATCHES_REMOVE,
  CONTAINER_BATCHES_LIST,
} from 'modules/permission/constants/container';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ORDER_ORDERITEMS_LIST, ORDER_FORM } from 'modules/permission/constants/order';
import {
  BATCH_CREATE,
  BATCH_LIST,
  BATCH_FORM,
  BATCH_UPDATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { SectionNavBar } from 'components/NavBar';
import { ContainerBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import ContainerFormContainer from 'modules/container/form/container';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import SelectOrderItems from 'providers/SelectOrderItems';
import BatchFormContainer from 'modules/batch/form/container';
import {
  BatchesSectionWrapperStyle,
  BatchesSectionBodyStyle,
  BatchesGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

function BatchesSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(CONTAINER_BATCHES_LIST)) return null;

  const allowUpdate = hasPermission(CONTAINER_UPDATE);
  const allowAddBatches =
    hasPermission(BATCH_LIST) && (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));
  const allowCreateBatches =
    hasPermission(BATCH_CREATE) &&
    hasPermission(ORDER_ORDERITEMS_LIST) &&
    (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));
  const allowCloneBatches =
    hasPermission(BATCH_CREATE) && (allowUpdate || hasPermission(CONTAINER_BATCHES_ADD));
  const allowRemoveBatches = allowUpdate || hasPermission(CONTAINER_BATCHES_REMOVE);

  if (!hasPermission(CONTAINER_BATCHES_LIST)) return null;

  return (
    <div className={BatchesSectionWrapperStyle}>
      <SectionNavBar>
        {allowAddBatches && (
          <BooleanValue>
            {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
              <>
                <NewButton
                  data-testid="selectBatchesButton"
                  label={
                    <FormattedMessage
                      id="modules.Shipments.selectBatches"
                      defaultMessage="SELECT BATCHES"
                    />
                  }
                  onClick={() => selectBatchesSlideToggle(true)}
                />
                <SlideView
                  isOpen={selectBatchesIsOpen}
                  onRequestClose={() => selectBatchesSlideToggle(false)}
                  options={{ width: '1030px' }}
                >
                  {selectBatchesIsOpen && (
                    <Subscribe to={[ContainerFormContainer]}>
                      {({ state: { batches }, setFieldValue, addExistingBatches }) => (
                        <SelectBatches
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
                    </Subscribe>
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
                <NewButton
                  label={
                    <FormattedMessage id="modules.Shipments.newBatch" defaultMessage="NEW BATCH" />
                  }
                  onClick={() => createBatchesSlideToggle(true)}
                />
                <SlideView
                  isOpen={createBatchesIsOpen}
                  onRequestClose={() => createBatchesSlideToggle(false)}
                  options={{ width: '1030px' }}
                >
                  {createBatchesIsOpen && (
                    <Subscribe to={[ContainerFormContainer]}>
                      {({ state: { batches }, setFieldValue }) => (
                        <SelectOrderItems
                          onSelect={selectedOrderItems => {
                            const newBatches = selectedOrderItems.map((orderItem, counter) => {
                              const {
                                productProvider: {
                                  packageName,
                                  packageCapacity,
                                  packageGrossWeight,
                                  packageVolume,
                                  packageSize,
                                },
                              } = orderItem;
                              return injectUid({
                                orderItem,
                                tags: [],
                                packageName,
                                packageCapacity,
                                packageGrossWeight,
                                packageVolume,
                                packageSize,
                                quantity: 0,
                                isNew: true,
                                batchAdjustments: [],
                                no: `batch no ${batches.length + counter + 1}`,
                                autoCalculatePackageQuantity: true,
                              });
                            });
                            if (batches.length === 0 && newBatches.length > 0) {
                              setFieldValue('representativeBatch', newBatches[0]);
                            }
                            setFieldValue('batches', [...batches, ...newBatches]);
                            createBatchesSlideToggle(false);
                          }}
                          onCancel={() => createBatchesSlideToggle(false)}
                        />
                      )}
                    </Subscribe>
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
        )}
      </SectionNavBar>
      <div className={BatchesSectionBodyStyle}>
        <Subscribe to={[ContainerFormContainer]}>
          {({
            state: { batches = [], representativeBatch },
            setFieldValue,
            setDeepFieldValue,
            addExistingBatches,
            removeExistingBatch,
          }) => {
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
                          options={{ width: '1030px' }}
                        >
                          {opened && (
                            <Subscribe to={[BatchFormContainer]}>
                              {({ initDetailValues }) => (
                                <BatchFormWrapper
                                  initDetailValues={initDetailValues}
                                  batch={batch}
                                  isNew={!!batch.isNew}
                                  orderItem={batch.orderItem}
                                  onCancel={() => batchSlideToggle(false)}
                                  onSave={updatedBatch => {
                                    batchSlideToggle(false);
                                    setDeepFieldValue(`batches.${position}`, updatedBatch);
                                  }}
                                />
                              )}
                            </Subscribe>
                          )}
                        </SlideView>
                        <div className={ItemStyle}>
                          <ContainerBatchCard
                            editable={{
                              no: hasPermission([BATCH_UPDATE, BATCH_SET_NO]),
                              quantity: hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY]),
                              deliveredAt: hasPermission([BATCH_UPDATE, BATCH_SET_DELIVERY_DATE]),
                              desiredAt: hasPermission([BATCH_UPDATE, BATCH_SET_DESIRED_DATE]),
                              removeBatch: allowRemoveBatches,
                              cloneBatch: allowCloneBatches,
                              viewOrder: hasPermission(ORDER_FORM),
                              viewShipment: hasPermission(SHIPMENT_FORM),
                              viewProduct: hasPermission(PRODUCT_FORM),
                              setRepresentativeBatch: hasPermission([
                                CONTAINER_UPDATE,
                                CONTAINER_BATCHES_ADD,
                                CONTAINER_BATCHES_REMOVE,
                              ]),
                            }}
                            position={position}
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
                              hasPermission(BATCH_FORM) ? () => batchSlideToggle(true) : () => {}
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
                            onClone={({
                              id,
                              deliveredAt,
                              desired,
                              expiredAt,
                              producedAt,
                              no,
                              ...rest
                            }) => {
                              const clonedBatch = injectUid({
                                ...rest,
                                isNew: true,
                                batchAdjustments: [],
                                no: `${no}- clone`,
                              });

                              setFieldValue('batches', [...batches, clonedBatch]);
                              addExistingBatches([clonedBatch]);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </BooleanValue>
                ))}
              </div>
            );
          }}
        </Subscribe>
      </div>
    </div>
  );
}

export default BatchesSection;
