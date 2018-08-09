// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { type Partner } from 'modules/partner/type.js.flow';
import messages from '../../../messages';
import { NameStyle, Name2Style, TypeStyle, PartnerItemStyle } from './style';

type Props = {
  partner: Partner,
  intl: intlShape,
};

function PartnerItem({ partner, intl }: Props) {
  if (!partner) return null;
  return (
    <div className={PartnerItemStyle}>
      <div
        className={NameStyle}
        title={intl.formatMessage(messages.tooltipName, { name: partner.name })}
      >
        <b>{partner.name}</b>
      </div>
      <div className={Name2Style}>
        <b>{partner.name2}</b>
      </div>
      <div className={TypeStyle}>
        <b>{intl.formatMessage(messages[partner.type.toLowerCase()])}</b>
      </div>
    </div>
  );
}

export default injectIntl(PartnerItem);
