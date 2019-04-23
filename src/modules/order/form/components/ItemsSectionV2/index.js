// @flow
import * as React from 'react';
import { flatten } from 'lodash';
import { StringValue } from 'react-values';
import { Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import { FormContainer } from 'modules/form';
import { isNullOrUndefined } from 'utils/fp';
import ItemsArea from './ItemsArea';
import BatchesArea from './BatchesArea';
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
        <StringValue defaultValue={null}>
          {({ value: focusedItemIndex, set: changeFocusedItem }) => {
            let batches = [];
            if (isNullOrUndefined(focusedItemIndex)) {
              batches = flatten(orderItems.map(({ batches: itemBatches }) => itemBatches));
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
  );
};

export default ItemsSection;
