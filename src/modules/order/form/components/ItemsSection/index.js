// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { BooleanValue, NumberValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import FormattedNumber from 'components/FormattedNumber';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import useLocalStorage from 'hooks/useLocalStorage';
import Icon from 'components/Icon';
import { OrderInfoContainer, OrderItemsContainer } from 'modules/order/form/containers';
import { SectionHeader } from 'components/Form';
import { FormContainer } from 'modules/form';
import { orderFormItemsQuery } from './query';
import ItemsArea from './ItemsArea';
import BatchesArea from './BatchesArea';
import { ItemsSectionWrapperStyle, ItemsUIWrapperStyle, ItemsUIStyle } from './style';

type Props = {
  isNew: boolean,
  orderIsArchived: boolean,
  isLoading: boolean,
  entityId: string,
};

const ItemsSection = ({ isNew, orderIsArchived, isLoading, entityId }: Props) => {
  const [storedValue, setValue] = useLocalStorage('itemsIsExpanded', false);
  return (
    <BooleanValue value={storedValue} onChange={setValue}>
      {({ value: itemsIsExpanded, set: setItemsUI }) => (
        <Subscribe to={[OrderItemsContainer]}>
          {({ state: { orderItems, hasCalledItemsApiYet }, initDetailValues, setFieldValue }) => (
            <QueryPlaceHolder
              PlaceHolder={ListCardPlaceHolder}
              query={orderFormItemsQuery}
              entityId={entityId}
              isLoading={isLoading}
              onCompleted={result => {
                if (!hasCalledItemsApiYet) {
                  initDetailValues(getByPathWithDefault([], 'order.orderItems', result), true);
                }
              }}
            >
              {() => {
                if (!isNew && !hasCalledItemsApiYet) return <ListCardPlaceHolder />;

                return (
                  <>
                    <SectionHeader
                      icon="ORDER_ITEM"
                      title={
                        <>
                          <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />
                          {' ('}
                          {<FormattedNumber value={(orderItems || []).length} />}
                          {')'}
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
                        <NumberValue defaultValue={-1}>
                          {({ value: focusedItemIndex, set: changeFocusedItem }) => {
                            return (
                              <div className={ItemsSectionWrapperStyle}>
                                <ItemsArea
                                  isNew={isNew}
                                  itemsIsExpanded={itemsIsExpanded}
                                  order={order}
                                  orderItems={orderItems}
                                  setFieldValue={setFieldValue}
                                  setFieldTouched={setFieldTouched}
                                  focusedItemIndex={focusedItemIndex}
                                  onFocusItem={(index: number) => {
                                    if (focusedItemIndex === index) {
                                      changeFocusedItem(-1);
                                    } else {
                                      changeFocusedItem(index);
                                    }
                                  }}
                                  orderIsArchived={orderIsArchived}
                                />
                                <BatchesArea
                                  itemsIsExpanded={itemsIsExpanded}
                                  order={order}
                                  orderItems={orderItems}
                                  setFieldValue={setFieldValue}
                                  setFieldTouched={setFieldTouched}
                                  focusedItemIndex={focusedItemIndex}
                                  orderIsArchived={orderIsArchived}
                                />
                              </div>
                            );
                          }}
                        </NumberValue>
                      )}
                    </Subscribe>
                  </>
                );
              }}
            </QueryPlaceHolder>
          )}
        </Subscribe>
      )}
    </BooleanValue>
  );
};

export default ItemsSection;
