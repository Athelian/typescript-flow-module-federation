// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { flatten } from 'lodash';
import { BooleanValue, StringValue } from 'react-values';
import useLocalStorage from 'hooks/useLocalStorage';
import Icon from 'components/Icon';
import { OrderInfoContainer, OrderItemsContainer } from 'modules/order/form/containers';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { FormContainer } from 'modules/form';
import { isNullOrUndefined } from 'utils/fp';
import ItemsArea from './ItemsArea';
import BatchesArea from './BatchesArea';
import { ItemsSectionWrapperStyle, ItemsUIWrapperStyle, ItemsUIStyle } from './style';

type Props = {
  isNew: boolean,
};

const ItemsSection = ({ isNew }: Props) => {
  console.warn({
    isNew,
  });
  const [storedValue, setValue] = useLocalStorage('itemsIsExpanded', false);
  return (
    <BooleanValue value={storedValue} onChange={setValue}>
      {({ value: itemsIsExpanded, set: setItemsUI }) => (
        <SectionWrapper id="order_itemsSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: { orderItems }, setFieldValue }) => (
              <>
                <SectionHeader
                  icon="ORDER_ITEM"
                  title={
                    <>
                      <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" /> (
                      {orderItems ? orderItems.length : 0})
                    </>
                  }
                >
                  <div className={ItemsUIWrapperStyle}>
                    <button
                      className={ItemsUIStyle({
                        isActive: !itemsIsExpanded,
                        flipped: false,
                      })}
                      onClick={() => setItemsUI(false)}
                      type="button"
                    >
                      <Icon icon="TH_LIST" />
                    </button>
                    <button
                      className={ItemsUIStyle({
                        isActive: itemsIsExpanded,
                        flipped: true,
                      })}
                      onClick={() => setItemsUI(true)}
                      type="button"
                    >
                      <Icon icon="TH_LIST" />
                    </button>
                  </div>
                </SectionHeader>
                <Subscribe to={[OrderInfoContainer, FormContainer]}>
                  {({ state: order }, { setFieldTouched }) => (
                    <StringValue defaultValue={null}>
                      {({ value: focusedItemIndex, set: changeFocusedItem }) => {
                        let batches = [];
                        if (isNullOrUndefined(focusedItemIndex)) {
                          batches = flatten(
                            orderItems.map(({ batches: itemBatches }) => itemBatches)
                          );
                        } else {
                          batches = [...orderItems[focusedItemIndex].batches];
                        }

                        return (
                          <div className={ItemsSectionWrapperStyle}>
                            <ItemsArea
                              itemsIsExpanded={itemsIsExpanded}
                              order={order}
                              orderItems={orderItems}
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              focusedItemIndex={focusedItemIndex}
                              onFocusItem={(index: number) => {
                                if (focusedItemIndex === index) {
                                  changeFocusedItem(null);
                                } else {
                                  changeFocusedItem(index);
                                }
                              }}
                            />
                            <BatchesArea
                              itemsIsExpanded={itemsIsExpanded}
                              batches={batches}
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              focusedItemIndex={focusedItemIndex}
                            />
                          </div>
                        );
                      }}
                    </StringValue>
                  )}
                </Subscribe>
              </>
            )}
          </Subscribe>
        </SectionWrapper>
      )}
    </BooleanValue>
  );
};

export default ItemsSection;
