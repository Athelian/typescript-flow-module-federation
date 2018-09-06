// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ArrayValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import OrderFormContainer from 'modules/order/form/container';
import { SectionNavBar } from 'components/NavBar';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import messages from 'modules/order/messages';
import ExpandButtons from './components/ExpandButtons';
import {
  ItemsSectionWrapperStyle,
  ItemsSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  TitleWrapperStyle,
  TitleStyle,
  IconStyle,
  BatchGridStyle,
  BatchStyle,
  EmptyMessageStyle,
} from './style';
import SelectProducts from '../SelectProducts';

type Props = {
  intl: intlShape,
  initialValues: {
    exporter: {
      id: string,
    },
  },
  isNew: boolean,
  onSelectItems: Function,
};

function generateBatchItem(item, batches) {
  return {
    tags: [],
    quantity: 0,
    batchAdjustments: [],
    id: `${item.id}-batch-id-${batches.length + 1}`,
    no: `batch no ${batches.length + 1}`,
  };
}

function ItemSection({ intl, isNew, initialValues, onSelectItems }: Props) {
  const { exporter = {} } = initialValues;

  return (
    <BooleanValue>
      {({ value: allItemsExpanded, toggle: toggleExpand }) => (
        <div className={ItemsSectionWrapperStyle}>
          <SectionNavBar>
            <ExpandButtons expanded={allItemsExpanded} onClick={toggleExpand} />

            <BooleanValue>
              {({ value: opened, toggle }) => (
                <>
                  <Subscribe to={[OrderFormContainer]}>
                    {({ state }) => (
                      <NewButton
                        title={intl.formatMessage(messages.newItems)}
                        disabled={!((state.exporter && state.exporter.id) || !isNew)}
                        onClick={toggle}
                      />
                    )}
                  </Subscribe>
                  <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '1030px' }}>
                    {opened && (
                      <SelectProducts
                        onSelect={selectedItems => {
                          onSelectItems(
                            selectedItems.map(productProvider =>
                              injectUid({
                                productProvider,
                                batches: [],
                                quantity: 0,
                                price: {
                                  amount: 0,
                                  currency: '',
                                },
                              })
                            )
                          );
                          toggle();
                        }}
                        exporter={exporter && exporter.id}
                        onCancel={toggle}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </SectionNavBar>
          <div className={ItemsSectionBodyStyle}>
            <Subscribe to={[OrderFormContainer]}>
              {({ state: { currency, orderItems }, setFieldArrayValue }) => (
                <ArrayValue defaultValue={[]}>
                  {({ value: selected, push, set }) =>
                    orderItems.length > 0 ? (
                      <div className={ItemGridStyle}>
                        {orderItems.map((item, index) => (
                          <div className={ItemStyle} key={item.id}>
                            <OrderItemCard
                              item={item}
                              currency={currency}
                              saveOnBlur={newValue =>
                                setFieldArrayValue('orderItems', index, newValue)
                              }
                              selected={selected.includes(item.id)}
                              selectable
                              onClick={() => {
                                if (!selected.includes(item.id)) {
                                  push(item.id);
                                } else {
                                  set(selected.filter(selectedId => selectedId !== item.id));
                                }
                              }}
                            />

                            {(allItemsExpanded || selected.includes(item.id)) &&
                              (item.batches && (
                                <ArrayValue
                                  defaultValue={item.batches}
                                  onChange={batches =>
                                    setFieldArrayValue('orderItems', index, { batches })
                                  }
                                >
                                  {({ value: batches, push: addNewBatch, splice: changeBatch }) => (
                                    <div className={BatchAreaStyle}>
                                      <div className={BatchAreaHeaderStyle}>
                                        <div className={TitleWrapperStyle}>
                                          <div className={IconStyle}>
                                            <Icon icon="BATCH" />
                                          </div>
                                          <div className={TitleStyle}>
                                            BATCHES ({batches.length})
                                          </div>
                                        </div>
                                        <NewButton
                                          title="NEW BATCH"
                                          onClick={() =>
                                            addNewBatch(generateBatchItem(item, batches))
                                          }
                                        />
                                      </div>

                                      <div className={BatchGridStyle}>
                                        {batches.map((batch, position) => (
                                          <div className={BatchStyle} key={batch.id}>
                                            <OrderBatchCard
                                              batch={batch}
                                              currency={currency}
                                              price={item.price}
                                              saveOnBlur={updatedBatch =>
                                                changeBatch(position, 1, updatedBatch)
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </ArrayValue>
                              ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={EmptyMessageStyle}>
                        {intl.formatMessage(messages.noItems)}
                      </div>
                    )
                  }
                </ArrayValue>
              )}
            </Subscribe>
          </div>
        </div>
      )}
    </BooleanValue>
  );
}

export default injectIntl(ItemSection);
