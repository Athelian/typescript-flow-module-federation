// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import { Display } from 'components/Form';
import CornerIcon from 'components/CornerIcon';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { CardStyle } from './style';

const PartnerDisplay = ({ value }: DisplayProps<Object | null>) => (
  <div className={CellDisplayWrapperStyle}>
    {value && (
      <div className={CardStyle}>
        <Display height="20px">{value?.name}</Display>

        <CornerIcon icon="PARTNER" color={colors.PARTNER} />
      </div>
    )}
  </div>
);

export default PartnerDisplay;
