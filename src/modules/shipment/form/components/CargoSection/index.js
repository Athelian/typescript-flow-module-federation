// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
import { SectionNavBar } from 'components/NavBar';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import messages from 'modules/shipment/messages';
import { EmptyMessageStyle } from 'modules/order/form/components/ItemsSection/style';
import { ShipmentInfoContainer, ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { ItemsSectionWrapperStyle, ItemsSectionBodyStyle } from './style';
import SelectBatches from '../SelectBatches';

type Props = {
  intl: intlShape,
};

function CargoSection({ intl }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      <SectionNavBar>
        <Subscribe to={[ShipmentInfoContainer]}>
          {({ state: { forwarders } }) => (
            <BooleanValue>
              {({ value: opened, toggle }) => (
                <>
                  <NewButton
                    title={intl.formatMessage(messages.newBatch)}
                    disabled={forwarders.length === 0}
                    onClick={toggle}
                  />

                  <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '1030px' }}>
                    {opened && <SelectBatches onCancel={toggle} onSelect={console.warn} />}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          )}
        </Subscribe>
      </SectionNavBar>
      <div className={ItemsSectionBodyStyle}>
        <Subscribe to={[ShipmentBatchesContainer]}>
          {({ state: { batches } }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>{intl.formatMessage(messages.noItems)}</div>
            ) : (
              <h3> Test </h3>
            )
          }
        </Subscribe>
      </div>
    </div>
  );
}

export default injectIntl(CargoSection);
