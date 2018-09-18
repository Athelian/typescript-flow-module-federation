// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { ShipmentBatchCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import messages from 'modules/shipment/messages';
import { EmptyMessageStyle } from 'modules/order/form/components/ItemsSection/style';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { ItemsSectionWrapperStyle, ItemsSectionBodyStyle, ItemGridStyle, ItemStyle } from './style';
import SelectBatches from '../SelectBatches';

type Props = {
  intl: intlShape,
};

function CargoSection({ intl }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      <SectionNavBar>
        <BooleanValue>
          {({ value: opened, toggle }) => (
            <>
              <NewButton title={intl.formatMessage(messages.newBatch)} onClick={toggle} />

              <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '1030px' }}>
                {opened && (
                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ setFieldValue }) => (
                      <SelectBatches
                        onCancel={toggle}
                        onSelect={selected => {
                          toggle();
                          setFieldValue('batches', selected);
                        }}
                      />
                    )}
                  </Subscribe>
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      </SectionNavBar>
      <div className={ItemsSectionBodyStyle}>
        <Subscribe to={[ShipmentBatchesContainer]}>
          {({ state: { batches }, setFieldValue, setFieldArrayValue }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>No batches found.</div>
            ) : (
              <div className={ItemGridStyle}>
                {batches.map((item, position) => (
                  <div className={ItemStyle} key={item.id}>
                    <ShipmentBatchCard
                      batch={item}
                      saveOnBlur={updateBatch => {
                        setFieldArrayValue(position, updateBatch);
                      }}
                      onRemove={({ id }) => {
                        setFieldValue('batches', batches.filter(({ id: itemId }) => id !== itemId));
                      }}
                      onClone={({ id, ...rest }) => {
                        setFieldValue('batches', [
                          ...batches,
                          injectUid({
                            ...rest,
                            isNew: true,
                          }),
                        ]);
                      }}
                    />
                  </div>
                ))}
              </div>
            )
          }
        </Subscribe>
      </div>
    </div>
  );
}

export default injectIntl(CargoSection);
