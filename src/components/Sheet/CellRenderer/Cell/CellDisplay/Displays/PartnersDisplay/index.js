// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import CornerIcon from 'components/CornerIcon';
import { Display } from 'components/Form';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CardStyle, PartnersWrapperStyle } from './style';

const PartnersDisplay = ({ value }: DisplayProps<Array<Object>>) => (
  <div className={CellDisplayWrapperStyle}>
    <div className={PartnersWrapperStyle}>
      {value.map(partner => (
        <div className={CardStyle} key={partner.id}>
          <Display height="20px">{partner.name}</Display>

          <CornerIcon icon="PARTNER" color={colors.PARTNER} />
        </div>
      ))}
    </div>
  </div>
);

export default PartnersDisplay;
