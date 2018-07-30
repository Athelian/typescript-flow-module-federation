// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { WrapperStyle, ActiveStyle, ArchivedStyle, TabsDisabledStyle } from './style';
import messages from './messages';

type Props = {
  disabled?: boolean,
  color: string,
  isActive?: boolean,
  onActive: () => void,
  onArchived: () => void,
};

const defaultProps = {
  disabled: false,
  isActive: false,
};

const Tabs = ({ disabled, isActive, onActive, onArchived, color }: Props) => (
  <div className={WrapperStyle}>
    <button
      onClick={onActive}
      className={disabled ? TabsDisabledStyle : ActiveStyle(!!isActive, color)}
    >
      <FormattedMessage {...messages.active} />
    </button>
    <button
      onClick={onArchived}
      className={disabled ? TabsDisabledStyle : ArchivedStyle(!!isActive, color)}
    >
      <FormattedMessage {...messages.archived} />
    </button>
  </div>
);

Tabs.defaultProps = defaultProps;

export default Tabs;
