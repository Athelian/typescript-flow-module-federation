// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createBooleanValue } from 'react-values';
import Icon from 'components/Icon';
import { ToggleButtonStyle, StatusStyle } from './style';

const TagValue = createBooleanValue(false);

const ToggleTag = () => (
  <TagValue>
    {({ value: isToggle, toggle }) => (
      <div className={StatusStyle(isToggle)}>
        <Icon icon="TAGS" />
        <FormattedMessage id="modules.RelationMaps.filter.tags" defaultMessage="TAGS" />
        <button
          type="button"
          className={ToggleButtonStyle(isToggle)}
          tabIndex={-1}
          onClick={toggle}
        >
          {isToggle ? <Icon icon="TOGGLE_ON" /> : <Icon icon="TOGGLE_OFF" />}
        </button>
      </div>
    )}
  </TagValue>
);

export { TagValue };
export default ToggleTag;
