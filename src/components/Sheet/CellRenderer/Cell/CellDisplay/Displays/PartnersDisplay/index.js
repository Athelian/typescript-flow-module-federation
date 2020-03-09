// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import CornerIcon from 'components/CornerIcon';
import { Display } from 'components/Form';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CardStyle, PartnersWrapperStyle, PartnerCodeStyle } from './style';

const PartnersDisplay = ({ value }: DisplayProps<Array<Object>>) => (
  <div className={CellDisplayWrapperStyle}>
    <div className={PartnersWrapperStyle}>
      {value.map(partner => {
        const name = partner?.partner?.name || partner?.name || partner?.organization?.name || '';
        const code = partner?.partner?.code || '';

        return (
          <div className={CardStyle} key={partner.id}>
            <Display height="20px">{name}</Display>
            <div className={PartnerCodeStyle}>{code}</div>
            <CornerIcon icon="PARTNER" color={colors.PARTNER} />
          </div>
        );
      })}
    </div>
  </div>
);

export default PartnersDisplay;
