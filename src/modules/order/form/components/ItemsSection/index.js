// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ArrayValue } from 'react-values';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import messages from 'modules/order/messages';
import { OrderInfoContainer, OrderItemsContainer } from 'modules/order/form/containers';
import { FormContainer } from 'modules/form';
import SelectProducts from 'modules/order/common/SelectProducts';
import ExpandButtons from './components/ExpandButtons';
import OrderItems from './components/OrderItems';
import { ItemsSectionWrapperStyle, ItemsSectionBodyStyle } from './style';

type Props = {
  intl: IntlShape,
  isNew: boolean,
};

function ItemSection({ intl, isNew }: Props) {
  return (
    <ArrayValue defaultValue={[]}>
      {({ value: selected, push, set }) => (
        <BooleanValue>
          {({ value: allItemsExpanded, set: toggleExpand }) => (
            <div className={ItemsSectionWrapperStyle}>
              <SectionNavBar>
                <ExpandButtons
                  type="COMPRESS"
                  onClick={() => {
                    toggleExpand(false);
                    set([]);
                  }}
                />
                <ExpandButtons type="EXPAND" onClick={() => toggleExpand(true)} />

                <Subscribe to={[OrderInfoContainer]}>
                  {({ state: { exporter, currency } }) => (
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          <NewButton
                            label={intl.formatMessage(messages.newItems)}
                            disabled={!((exporter && exporter.id) || !isNew)}
                            onClick={() => slideToggle(true)}
                          />

                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <Subscribe to={[OrderItemsContainer, FormContainer]}>
                                {(
                                  { state: { orderItems }, setFieldValue },
                                  { setFieldTouched }
                                ) => (
                                  <SelectProducts
                                    onSelect={selectedItems => {
                                      setFieldValue('orderItems', [
                                        ...orderItems,
                                        ...selectedItems.map(productProvider =>
                                          injectUid({
                                            productProvider,
                                            isNew: true,
                                            batches: [],
                                            quantity: 0,
                                            price: {
                                              amount: 0,
                                              currency,
                                            },
                                          })
                                        ),
                                      ]);
                                      setFieldTouched('orderItems');
                                      slideToggle(false);
                                    }}
                                    exporter={exporter && exporter.id}
                                    onCancel={() => slideToggle(false)}
                                  />
                                )}
                              </Subscribe>
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
                </Subscribe>
              </SectionNavBar>
              <div id="orderItemsSection" className={ItemsSectionBodyStyle}>
                <Subscribe to={[OrderInfoContainer, OrderItemsContainer, FormContainer]}>
                  {(
                    { state: { currency } },
                    { state: { orderItems }, setFieldValue, setFieldArrayValue },
                    { setFieldTouched }
                  ) => (
                    <OrderItems
                      selected={selected}
                      arrayHelpers={{ push, set }}
                      allItemsExpanded={allItemsExpanded}
                      currency={currency}
                      orderItems={orderItems}
                      onClone={({ id, ...rest }) => {
                        setFieldValue('orderItems', [
                          ...orderItems,
                          injectUid({
                            ...rest,
                            isNew: true,
                          }),
                        ]);
                        setFieldTouched(`orderItems.${id}`);
                      }}
                      onRemove={({ id }) => {
                        setFieldValue(
                          'orderItems',
                          orderItems.filter(({ id: itemId }) => id !== itemId)
                        );
                        setFieldTouched(`orderItems.${id}`);
                      }}
                      onSave={(index, newValue) => {
                        setFieldArrayValue(index, newValue);
                        setFieldTouched(`orderItems.${index}`);
                      }}
                    />
                  )}
                </Subscribe>
              </div>
            </div>
          )}
        </BooleanValue>
      )}
    </ArrayValue>
  );
}

export default injectIntl(ItemSection);
