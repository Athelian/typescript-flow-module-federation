// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { ExpandRows, Entities } from 'modules/relationMapV2/store';

export default function ExpandButton() {
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const { mapping } = Entities.useContainer();
  const onClick = () => {
    if (expandRows.length === mapping.orders.length) {
      setExpandRows([]);
    } else {
      setExpandRows(Object.keys(mapping.entities?.orders ?? {}));
    }
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: 330,
        top: 13,
        cursor: 'pointer',
        zIndex: 1,
      }}
    >
      <BaseButton
        label={
          <FormattedMessage
            id="components.button.expandOrCollapse"
            defaultMessage="Expand/Collapse all"
          />
        }
        onClick={onClick}
      />
    </div>
  );
}
