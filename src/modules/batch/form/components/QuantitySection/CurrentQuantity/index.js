// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, FormTooltip } from 'components/Form';
import { CurrentQuantityWrapperStyle } from './style';

type Props = {|
  children: React$Node,
|};

export default function CurrentQuantity({ children }: Props) {
  return (
    <div className={CurrentQuantityWrapperStyle}>
      {children}

      <Label width="min-content">
        <FormattedMessage id="modules.Batches.currentQuantity" defaultMessage="CURRENT QUANTITY" />
      </Label>

      <FormTooltip
        infoMessage={
          <FormattedMessage
            id="components.Batches.currentQuantityExplanation"
            defaultMessage="The Current Quantity is determined based on the quantity with a value that is the furthest down this list"
          />
        }
      />
    </div>
  );
}
