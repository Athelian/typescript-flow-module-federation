// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, intlShape } from 'react-intl';
import { ArrayValue } from 'react-values';
import FormContainer from 'modules/form/container';
import { OrderItemsContainer, OrderInfoContainer } from 'modules/order/form/containers';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import Icon from 'components/Icon';
import {
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
} from 'modules/order/form/components/ItemsSection/style';
import messages from 'modules/order/messages';

type Props = {
  intl: intlShape,
  selected: Array<string>,
  allItemsExpanded: boolean,
  arrayHelpers: {
    push: Function,
    set: Function,
  },
};

function generateBatchItem(item, batches) {
  return {
    tags: [],
    quantity: 0,
    isNew: true,
    batchAdjustments: [],
    id: `${item.id}-batch-id-${batches.length + 1}`,
    no: `batch no ${batches.length + 1}`,
  };
}

const OrderItems = ({ intl, selected, allItemsExpanded, arrayHelpers: { push, set } }: Props) => (
  <Subscribe to={[OrderInfoContainer, OrderItemsContainer]}>
    {({ state: { currency } }, { state: { orderItems } }) =>
      orderItems.length > 0 ? (
        <div className={ItemGridStyle}>
          {orderItems.map(item => (
            <div className={ItemStyle} key={item.id}>
              <Subscribe to={[FormContainer]}>
                {({ setFieldTouched }) => (
                  <OrderItemCard
                    item={item}
                    currency={currency}
                    saveOnBlur={() => {
                      // setFieldArrayValue('orderItems', index, newValue);
                      setFieldTouched('orderItems');
                    }}
                    selected={selected.includes(item.id)}
                    onClick={() => {
                      if (!selected.includes(item.id)) {
                        push(item.id);
                      } else {
                        set(selected.filter(selectedId => selectedId !== item.id));
                      }
                    }}
                  />
                )}
              </Subscribe>
              {(allItemsExpanded || (!allItemsExpanded && selected.includes(item.id))) &&
                (item.batches && (
                  <ArrayValue
                    defaultValue={item.batches}
                    // onChange={batches =>
                    //   setFieldArrayValue('orderItems', index, { batches })
                    // }
                  >
                    {({ value: batches, push: addNewBatch, splice: changeBatch }) => (
                      <div className={BatchAreaStyle}>
                        <div className={BatchAreaHeaderStyle}>
                          <div className={TitleWrapperStyle}>
                            <div className={IconStyle}>
                              <Icon icon="BATCH" />
                            </div>
                            <div className={TitleStyle}>BATCHES ({batches.length})</div>
                          </div>
                          <NewButton
                            title="NEW BATCH"
                            onClick={() => addNewBatch(generateBatchItem(item, batches))}
                          />
                        </div>

                        <div className={BatchGridStyle}>
                          {batches.map((batch, position) => (
                            <div className={BatchStyle} key={batch.id}>
                              <Subscribe to={[FormContainer]}>
                                {({ setFieldTouched }) => (
                                  <OrderBatchCard
                                    batch={batch}
                                    currency={currency}
                                    price={item.price}
                                    saveOnBlur={updatedBatch => {
                                      setFieldTouched('batches');
                                      changeBatch(position, 1, updatedBatch);
                                    }}
                                  />
                                )}
                              </Subscribe>
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
        <div className={EmptyMessageStyle}>{intl.formatMessage(messages.noItems)}</div>
      )
    }
  </Subscribe>
);
export default injectIntl(OrderItems);
