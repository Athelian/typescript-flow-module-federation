// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { WrapperStyle, QuantityLabelStyle } from './style';

type Props = {|
  children: React$Node,
|};

export default function CurrentQuantity({ children }: Props) {
  return (
    <div className={WrapperStyle}>
      {children}
      <div className={QuantityLabelStyle}>
        <FormattedMessage id="modules.Batches.currentQuantity" defaultMessage="CURRENT QUANTITY" />
        <Tooltip
          message={
            <FormattedMessage
              id="components.Batches.currentQuantityExplanation"
              defaultMessage="The Current Quantity is determined based on the quantity with a value that is the furthest down this list"
            />
          }
        >
          <div>
            <Icon icon="INFO" />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
