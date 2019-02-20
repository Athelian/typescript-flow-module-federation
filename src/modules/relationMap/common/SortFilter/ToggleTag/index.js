// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createBooleanValue } from 'react-values';
import { Label, ToggleInput } from 'components/Form';
import Icon from 'components/Icon';
import { getInitShowTag } from 'modules/relationMapBeta/order/store';
import { ToggleTagWrapperStyle, ToggleTagIconStyle } from './style';

const TagValue = createBooleanValue(getInitShowTag());

type OptionalProps = {
  onToggle: Function,
};
type Props = OptionalProps & {};

const ToggleTag = ({ onToggle }: Props) => (
  <TagValue>
    {({ value: isToggle, toggle }) => (
      <div className={ToggleTagWrapperStyle}>
        <div className={ToggleTagIconStyle}>
          <Icon icon="TAG" />
        </div>
        <Label>
          <FormattedMessage id="modules.RelationMaps.filter.tags" defaultMessage="TAGS" />
        </Label>
        <ToggleInput
          toggled={isToggle}
          onToggle={() => {
            toggle();
            onToggle(!isToggle);
            if (window.localStorage) {
              window.localStorage.setItem('filterRMTags', JSON.stringify({ showTag: !isToggle }));
            }
          }}
        />
      </div>
    )}
  </TagValue>
);

ToggleTag.defaultProps = {
  onToggle: () => {},
};

export { TagValue };
export default ToggleTag;
