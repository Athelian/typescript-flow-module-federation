// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { NewButton } from 'components/Buttons';
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
    <div className={ContainersWrapperStyle}>
      <div className={ContainersNavbarWrapperStyle} />
      <div className={ContainersBodyWrapperStyle}>{selectedContainer}</div>
      <div className={ContainersFooterWrapperStyle}>
        <NewButton label={intl.formatMessage(messages.newContainer)} onClick={() => {}} />
      </div>
    </div>
  );
}

export default injectIntl(ContainersArea);
