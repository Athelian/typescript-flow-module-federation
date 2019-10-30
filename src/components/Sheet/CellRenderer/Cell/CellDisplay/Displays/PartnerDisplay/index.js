// @flow
import * as React from 'react';
import { Display } from 'components/Form';
import Icon from 'components/Icon';
import DisplayWrapper from '../DisplayWrapper';
import { PartnerSelectorCardStyle, CornerIconStyle } from './style';

type Props = {
  value: Object,
};

const PartnerDisplay = ({ value }: Props) => {
  return (
    <DisplayWrapper>
      <div className={PartnerSelectorCardStyle}>
        <Display height="20px">{value.name}</Display>

        <div className={CornerIconStyle}>
          <Icon icon="PARTNER" />
        </div>
      </div>
    </DisplayWrapper>
  );
};

export default PartnerDisplay;
