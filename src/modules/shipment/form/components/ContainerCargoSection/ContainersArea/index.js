// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { NewButton } from 'components/Buttons';
import { ShipmentContainersContainer } from 'modules/shipment/form/containers';
import messages from 'modules/shipment/messages';
import {
  ContainersWrapperStyle,
  ContainersNavbarWrapperStyle,
  ContainersBodyWrapperStyle,
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  intl: IntlShape,
  selectedContainer: ?string,
};

function ContainersArea({ intl, selectedContainer }: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer]}>
      {({ state: { containers } }) => (
        <div className={ContainersWrapperStyle}>
          <div className={ContainersNavbarWrapperStyle} />
          <div className={ContainersBodyWrapperStyle}>
            {selectedContainer}
            {containers.length}
          </div>
          <div className={ContainersFooterWrapperStyle}>
            <NewButton label={intl.formatMessage(messages.newContainer)} onClick={() => {}} />
          </div>
        </div>
      )}
    </Subscribe>
  );
}

export default injectIntl(ContainersArea);
