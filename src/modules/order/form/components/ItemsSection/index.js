// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ArrayValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import messages from 'modules/order/messages';
import { OrderInfoContainer } from 'modules/order/form/containers';
import ExpandButtons from './components/ExpandButtons';
import OrderItems from './components/OrderItems';
import { ItemsSectionWrapperStyle, ItemsSectionBodyStyle } from './style';
import SelectProducts from '../SelectProducts';

type Props = {
  intl: intlShape,

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
                  expanded={!allItemsExpanded}
                  onClick={() => {
                    toggleExpand(false);
                    set([]);
                  }}
                />
                <ExpandButtons
                  type="EXPAND"
                  expanded={allItemsExpanded}
                  onClick={() => toggleExpand(true)}
                />

                <Subscribe to={[OrderInfoContainer]}>
                  {({ state: { exporter, currency } }) => (
                    <BooleanValue>
                      {({ value: opened, toggle }) => (
                        <>
                          <NewButton
                            title={intl.formatMessage(messages.newItems)}
                            disabled={!((exporter && exporter.id) || !isNew)}
                            onClick={toggle}
                          />

                          <SlideView
                            isOpen={opened}
                            onRequestClose={toggle}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <SelectProducts
                                onSelect={selectedItems => {
                                  console.warn(
                                    selectedItems.map(productProvider =>
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
                  )}
                </Subscribe>
              </SectionNavBar>
              <div className={ItemsSectionBodyStyle}>
                <OrderItems
                  selected={selected}
                  arrayHelpers={{ push, set }}
                  allItemsExpanded={allItemsExpanded}
                />
              </div>
            </div>
          )}
        </BooleanValue>
      )}
    </ArrayValue>
  );
}

export default injectIntl(ItemSection);
