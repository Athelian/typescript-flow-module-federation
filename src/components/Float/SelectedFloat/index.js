// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';

import { SelectedEntitiesWrapperStyle, TotalEntitiesStyle, ClearTotalButtonStyle } from './style';

type Props = {
  selectCount: number,
  onClearClicked?: Function,
  showOnEmpty?: boolean,
};

const SelectedFloat = ({ selectCount, onClearClicked, showOnEmpty = false }: Props) => {
  if (!showOnEmpty && !selectCount) {
    return null;
  }

  return (
    <div className={SelectedEntitiesWrapperStyle}>
      <div className={TotalEntitiesStyle}>
        <Label color="TEAL" align="center">
          <FormattedNumber value={selectCount || 0} />{' '}
          <FormattedMessage id="modules.relationalMap.selected" defaultMessage="SELECTED" />
        </Label>
        <button
          className={ClearTotalButtonStyle}
          onClick={() => {
            if (onClearClicked) {
              onClearClicked();
            }
          }}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      </div>
    </div>
  );
};

export default SelectedFloat;
