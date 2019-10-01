// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { ExpandRows, Entities } from 'modules/relationMapV2/store';
import { ExpandButtonStyle } from './style';

export default function ExpandButton() {
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const { mapping } = Entities.useContainer();

  const allIsExpanded = expandRows.length === mapping.orders.length;

  return (
    <Tooltip
      delay={1000}
      message={
        allIsExpanded ? (
          <FormattedMessage
            id="components.button.collapseTooltip"
            defaultMessage="Collapse all Orders"
          />
        ) : (
          <FormattedMessage
            id="components.button.expandTooltip"
            defaultMessage="Expand all Orders"
          />
        )
      }
    >
      <button
        onClick={() => {
          if (allIsExpanded) {
            setExpandRows([]);
          } else {
            setExpandRows(Object.keys(mapping.entities?.orders || {}));
          }
        }}
        className={ExpandButtonStyle(allIsExpanded)}
        type="button"
      >
        <Icon icon={allIsExpanded ? 'COMPRESS' : 'EXPAND'} />
      </button>
    </Tooltip>
  );
}
