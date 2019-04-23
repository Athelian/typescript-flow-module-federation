// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import { Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import { FormContainer } from 'modules/form';
import ItemsArea from './ItemsArea';
import { ItemsSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  itemsIsExpanded: boolean,
  orderItems: Array<Object>,
  setFieldValue: (string, any) => void,
};

const ItemsSection = ({ isNew, itemsIsExpanded, orderItems, setFieldValue }: Props) => {
  console.log(isNew);

  return (
    <Subscribe to={[OrderInfoContainer, FormContainer]}>
      {({ state: order }, { setFieldTouched }) => (
        <StringValue>
          {({ value: focusedItemIndex, set: changeFocusedItem }) => {
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
                <div>Batches</div>
              </div>
            );
          }}
        </StringValue>
      )}
    </Subscribe>
  );
};

export default ItemsSection;
