// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createBooleanValue } from 'react-values';
import { Label, ToggleInput } from 'components/Form';
import Icon from 'components/Icon';
import { ToggleTagWrapperStyle, ToggleTagIconStyle } from './style';

const TagValue = createBooleanValue(false);

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
