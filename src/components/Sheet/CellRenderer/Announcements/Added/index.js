// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSheetState } from 'components/Sheet/SheetState';
import type { Area } from 'components/Sheet/SheetState/types';
import messages from '../../../messages';
import { AddedStyle, LabelStyle } from './style';

type Props = {
  area: Area,
};

const Added = ({ area }: Props) => {
  const { state } = useSheetState();

  const height = Math.max(1, area.to.x + 1 - area.from.x) * 30;
  const width = state.columns
    .slice(area.from.y)
    .reduce((total, col) => total + (state.columnWidths[col.key] || col.width), 0);

  return (
    <div className={AddedStyle(height, width)}>
      <span className={LabelStyle}>
        <FormattedMessage {...messages.addedAnnouncement} />
      </span>
    </div>
  );
};

export default Added;
