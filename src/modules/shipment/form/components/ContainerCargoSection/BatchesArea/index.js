// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton, MoveButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import messages from 'modules/shipment/messages';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import BatchFormContainer, { calculatePackageQuantity } from 'modules/batch/form/container';
import SelectOrderItems from '../../CargoSection/components/SelectOrderItems';
import {
  BatchesWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  TitleWrapperStyle,
  IconStyle,
  TitleStyle,
  BatchesGridStyle,
  EmptyMessageStyle,
  BatchesFooterWrapperStyle,
} from './style';
import SelectBatches from '../../SelectBatches';

type Props = {
  intl: IntlShape,
  selectedContainer: ?string,
};

function BatchesArea({ intl, selectedContainer }: Props) {
  return (
    <div className={BatchesWrapperStyle}>
      <div className={BatchesNavbarWrapperStyle} />
      <div className={BatchesBodyWrapperStyle}>
        <Subscribe to={[ShipmentBatchesContainer]}>
          {({ state: { batches }, setFieldValue, setFieldArrayValue }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>
                <FormattedMessage
                  id="modules.Shipments.noBatches"
                  defaultMessage="No batches found"
                />
              </div>
            ) : (
              <>
                <div className={BatchesHeaderWrapperStyle}>
                  <div className={TitleWrapperStyle}>
                    <div className={IconStyle}>
                      <Icon icon="BATCH" />
                    </div>
                    <div className={TitleStyle}>
                      <FormattedMessage
                        id="modules.Shipments.allBatches"
                        defaultMessage="ALL BATCHES"
                      />
                      {` (5)`}
                      {selectedContainer}
                    </div>
                  </div>
                  <MoveButton label={intl.formatMessage(messages.moveBatches)} onClick={() => {}} />
                </div>
                <div className={BatchesGridStyle}>
                  {batches.map((item, position) => (
                    <BooleanValue key={item.id}>
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
                                    batch={item}
                                    isNew={!!item.isNew}
                                    orderItem={item.orderItem}
                                    onCancel={() => batchSlideToggle(false)}
                                    onSave={updatedBatch => {
                                      batchSlideToggle(false);
                                      setFieldArrayValue(position, updatedBatch);
                                    }}
                                  />
                                )}
                              </Subscribe>
                            )}
                          </SlideView>
                          <ShipmentBatchCard
                            batch={item}
                            saveOnBlur={updateBatch => {
                              setFieldArrayValue(position, updateBatch);
                            }}
                            onClick={() => batchSlideToggle(true)}
                            onClear={({ id }) => {
                              setFieldValue(
                                'batches',
                                batches.filter(({ id: itemId }) => id !== itemId)
                              );
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
                              setFieldValue('batches', [
                                ...batches,
                                injectUid({
                                  ...rest,
                                  isNew: true,
                                  batchAdjustments: [],
                                  no: `${no}- clone`,
                                }),
                              ]);
                            }}
                          />
                        </>
                      )}
                    </BooleanValue>
                  ))}
                </div>
              </>
            )
          }
        </Subscribe>
      </div>
      <div className={BatchesFooterWrapperStyle}>
        <BooleanValue>
          {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
            <>
              <NewButton
                data-testid="selectBatchesButton"
                label={intl.formatMessage(messages.selectBatches)}
                onClick={() => selectBatchesSlideToggle(true)}
              />
              <SlideView
                isOpen={selectBatchesIsOpen}
                onRequestClose={() => selectBatchesSlideToggle(false)}
                options={{ width: '1030px' }}
              >
                {selectBatchesIsOpen && (
                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ state: { batches }, setFieldValue }) => (
                      <SelectBatches
                        selectedBatches={batches}
                        onSelect={selected => {
                          const selectedBatches = selected.map(selectedBatch => ({
                            ...selectedBatch,
                            packageQuantity: calculatePackageQuantity(selectedBatch),
                          }));
                          setFieldValue('batches', [...batches, ...selectedBatches]);
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
        <BooleanValue>
          {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
            <>
              <NewButton
                label={intl.formatMessage(messages.newBatch)}
                onClick={() => createBatchesSlideToggle(true)}
              />
              <SlideView
                isOpen={createBatchesIsOpen}
                onRequestClose={() => createBatchesSlideToggle(false)}
                options={{ width: '1030px' }}
              >
                {createBatchesIsOpen && (
                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ state: { batches }, setFieldValue }) => (
                      <SelectOrderItems
                        onSelect={selectedOrderItems => {
                          const result = selectedOrderItems.map((orderItem, counter) => {
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
                          setFieldValue('batches', [...batches, ...result]);
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
      </div>
    </div>
  );
}

export default injectIntl(BatchesArea);
