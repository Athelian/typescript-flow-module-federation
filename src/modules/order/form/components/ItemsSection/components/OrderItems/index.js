// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { BooleanValue, ArrayValue } from 'react-values';
import { isEquals } from 'utils/fp';
import { injectUid } from 'utils/id';
import SlideView from 'components/SlideView';
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
import BatchFormWrapper from '../BatchFormWrapper';

type Props = {
  intl: intlShape,
  selected: Array<string>,
  orderItems: Array<Object>,
  currency: string,
  allItemsExpanded: boolean,
  arrayHelpers: {
    push: Function,
    set: Function,
  },
  onClone: Function,
  onRemove: Function,
  onSave: Function,
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

class OrderItems extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const { orderItems, selected, currency, allItemsExpanded } = this.props;
    if (
      !isEquals(orderItems, nextProps.orderItems) ||
      !isEquals(selected, nextProps.selected) ||
      !isEquals(currency, nextProps.currency) ||
      !isEquals(allItemsExpanded, nextProps.allItemsExpanded)
    )
      return true;

    return false;
  }

  render() {
    const {
      intl,
      selected,
      allItemsExpanded,
      orderItems,
      currency,
      arrayHelpers: { push, set },
      onClone,
      onRemove,
      onSave,
    } = this.props;

    return orderItems.length > 0 ? (
      <div className={ItemGridStyle}>
        {orderItems.map((item, index) => (
          <div className={ItemStyle} key={item.id}>
            <OrderItemCard
              item={item}
              currency={currency}
              saveOnBlur={newValue => onSave(index, newValue)}
              selected={selected.includes(item.id)}
              onClick={() => {
                if (!selected.includes(item.id)) {
                  push(item.id);
                } else {
                  set(selected.filter(selectedId => selectedId !== item.id));
                }
              }}
              onClone={onClone}
              onRemove={onRemove}
            />

            {(allItemsExpanded || (!allItemsExpanded && selected.includes(item.id))) &&
              (item.batches && (
                <ArrayValue
                  defaultValue={item.batches}
                  onChange={batches => onSave(index, { batches })}
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
                            <BooleanValue>
                              {({ value: opened, toggle }) => (
                                <>
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={toggle}
                                    options={{ width: '1030px' }}
                                  >
                                    {opened && (
                                      <BatchFormWrapper
                                        orderIndex={index}
                                        batchIndex={position}
                                        isNew={!!batch.isNew}
                                      />
                                    )}
                                  </SlideView>
                                  <OrderBatchCard
                                    batch={batch}
                                    currency={currency}
                                    price={item.price}
                                    onClick={toggle}
                                    saveOnBlur={updatedBatch => {
                                      changeBatch(position, 1, updatedBatch);
                                    }}
                                    onRemove={() => changeBatch(position, 1)}
                                    onClone={({ id, ...rest }) => {
                                      changeBatch(
                                        batches.length,
                                        1,
                                        injectUid({
                                          ...rest,
                                          isNew: true,
                                        })
                                      );
                                    }}
                                  />
                                </>
                              )}
                            </BooleanValue>
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
    );
  }
}

export default injectIntl(OrderItems);
