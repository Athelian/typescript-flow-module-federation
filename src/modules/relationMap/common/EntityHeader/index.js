// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import { EntityHeaderWrapperStyle, EntityHeaderIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  label: string | React.Node,
  no: number,
  onClick?: Function,
  children?: React.Node,
};

const EntityHeader = ({ icon, color, label, no, onClick, children }: Props) => (
  <div className={EntityHeaderWrapperStyle} role="presentation">
    {onClick ? (
      <BooleanValue>
        {({ value: isHovered, set: toggleHover }) => (
          <Tooltip
            message={
              <FormattedMessage
                id="components.RelationMaps.targetAllTooltip"
                defaultMessage="Target / Untarget All"
              />
            }
          >
            <button
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}
              className={EntityHeaderIconStyle(color)}
              type="button"
              onClick={onClick}
            >
              <Icon icon={isHovered ? 'CHECKED' : icon} />
            </button>
          </Tooltip>
        )}
      </BooleanValue>
    ) : (
      <div className={EntityHeaderIconStyle(color)}>
        <Icon icon={icon} />
      </div>
    )}
    <Label>
      {label} (<FormattedNumber value={no} />)
    </Label>
    {children}
  </div>
);

export default EntityHeader;
