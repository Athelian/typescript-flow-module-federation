// @flow
import * as React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { BooleanValue, ArrayValue } from 'react-values';
import { Subscribe } from 'unstated';
import scrollIntoView from 'utils/scrollIntoView';
import { OrderItemsContainer } from 'modules/order/form/containers';
import BatchFormContainer from 'modules/batch/form/container';
import { isEquals } from 'utils/fp';
import { injectUid } from 'utils/id';
import SlideView from 'components/SlideView';
import { OrderItemCard, OrderBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import Icon from 'components/Icon';
import messages from 'modules/order/messages';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import {
  ItemGridStyle,
  ItemStyle,
  BatchAreaStyle,
  BatchAreaHeaderStyle,
  TitleWrapperStyle,
  TitleStyle,
  IconStyle,
  BatchGridStyle,
  EmptyMessageStyle,
} from './style';

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

export function generateBatchItem(batches: Array<Object>) {
  return injectUid({
    tags: [],
    quantity: 0,
    isNew: true,
    batchAdjustments: [],
    no: `batch no ${batches.length + 1}`,
  });
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
          <div id={`orderItem_${item.id}`} className={ItemStyle} key={item.id}>
            <OrderItemCard
              item={item}
              currency={currency}
              saveOnBlur={newValue => onSave(index, newValue)}
              selected={selected.includes(item.id)}
              onClick={() => {
                scrollIntoView({
                  targetId: `orderItem_${item.id}`,
                  boundaryId: 'orderItemsSection',
                });
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
                          label={
                            <FormattedMessage
                              id="modules.order.newBatch"
                              defaultMessage="NEW BATCH"
                            />
                          }
                          onClick={() => addNewBatch(generateBatchItem(batches))}
                        />
                      </div>

                      <div className={BatchGridStyle}>
                        {batches.map((batch, position) => (
                          <BooleanValue key={batch.id}>
                            {({ value: opened, set: slideToggle }) => (
                              <>
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                  options={{ width: '1030px' }}
                                >
                                  {opened && (
                                    <Subscribe to={[BatchFormContainer, OrderItemsContainer]}>
                                      {({ initDetailValues }, { state }) => (
                                        <BatchFormWrapper
                                          batch={state.orderItems[index].batches[position]}
                                          isNew={!!batch.isNew}
                                          orderItem={item}
                                          initDetailValues={initDetailValues}
                                          onCancel={() => slideToggle(false)}
                                          onSave={updatedBatch => {
                                            slideToggle(false);
                                            changeBatch(position, 1, updatedBatch);
                                          }}
                                        />
                                      )}
                                    </Subscribe>
                                  )}
                                </SlideView>
                                <OrderBatchCard
                                  batch={batch}
                                  currency={currency}
                                  price={item.price}
                                  onClick={() => slideToggle(true)}
                                  saveOnBlur={updatedBatch => {
                                    changeBatch(position, 1, updatedBatch);
                                  }}
                                  onRemove={() => changeBatch(position, 1)}
                                  onClone={({ id, no, ...rest }) => {
                                    changeBatch(
                                      batches.length,
                                      1,
                                      injectUid({
                                        ...rest,
                                        no: `${no}- clone`,
                                        isNew: true,
                                      })
                                    );
                                  }}
                                />
                              </>
                            )}
                          </BooleanValue>
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
