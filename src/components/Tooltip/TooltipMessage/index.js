// @flow
import * as React from 'react';
import { isValuable, isValuables } from 'utils/value';
import ConfirmMessage from './ConfirmMessage';
import ChangedValue from './ChangedValue';
import Description from './Description';

type Props = {
  confirmMessage: React.Node,
  oldValue: React.Node,
  newValue: React.Node,
  description: React.Node,
};
function TooltipMessage({ confirmMessage, oldValue, newValue, description }: Props) {
  return (
    <div>
      {isValuable(confirmMessage) && <ConfirmMessage>{confirmMessage}</ConfirmMessage>}
      {isValuables(oldValue, newValue) && <ChangedValue newValue={newValue} oldValue={oldValue} />}
      {isValuable(description) && <Description>{description}</Description>}
    </div>
  );
}

export default TooltipMessage;
