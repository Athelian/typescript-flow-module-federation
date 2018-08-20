// @flow
import * as React from 'react';
import ConfirmMessage from './ConfirmMessage';
import ChangedValue from './ChangedValue';
import Description from './Description';

type Props = {
  title: string | React.Node,
  oldValue: React.Node,
  newValue: React.Node,
  description: React.Node,
};

function TooltipMessage({ title, oldValue, newValue, description }: Props) {
  return (
    <div>
      {title && <ConfirmMessage>{title}</ConfirmMessage>}
      {oldValue && newValue && <ChangedValue newValue={newValue} oldValue={oldValue} />}
      {description && <Description>{description}</Description>}
    </div>
  );
}

export default TooltipMessage;
