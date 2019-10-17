// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { GlobalExpanded, ExpandRows, Entities, FocusedView } from 'modules/relationMapV2/store';
import { ExpandButtonStyle } from './style';

export default function ExpandButton() {
  const { selectors } = FocusedView.useContainer();
  const { expandAll, setExpandAll } = GlobalExpanded.useContainer();
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const { mapping } = Entities.useContainer();
  const orderIds = Object.keys(mapping.entities?.orders ?? {}).filter(
    id => mapping.entities?.orders?.[id]?.orderItemCount
  );
  const shipmentIds = Object.keys(mapping.entities?.shipments ?? {}).filter(
    id =>
      mapping.entities?.shipments?.[id]?.containerCount ||
      mapping.entities?.shipments?.[id]?.batchCount
  );

  const allIsExpanded =
    expandRows.length > 0 && selectors.isShipmentFocus
      ? shipmentIds.length > 0 && expandRows.length === shipmentIds.length
      : orderIds.length > 0 && expandRows.length === orderIds.length;

  return (
    <>
      <Tooltip
        delay={1000}
        message={
          <FormattedMessage
            id="components.button.expandTooltip"
            defaultMessage="Expand all Orders. Loaded data will also be expanded."
          />
        }
      >
        <button
          onClick={() => {
            if (!allIsExpanded) {
              setExpandRows(selectors.isShipmentFocus ? shipmentIds : orderIds);
            }
            if (!expandAll) {
              setExpandAll(true);
            }
          }}
          className={ExpandButtonStyle(false, expandAll)}
          type="button"
        >
          <Icon icon="EXPAND" />
        </button>
      </Tooltip>

      <Tooltip
        delay={1000}
        message={
          <FormattedMessage
            id="components.button.collapseTooltip"
            defaultMessage="Collapse all Orders. Loaded data will also be collapsed."
          />
        }
      >
        <button
          onClick={() => {
            setExpandRows([]);
            if (expandAll) {
              setExpandAll(false);
            }
          }}
          className={ExpandButtonStyle(true, !expandAll)}
          type="button"
        >
          <Icon icon="COMPRESS" />
        </button>
      </Tooltip>
    </>
  );
}
