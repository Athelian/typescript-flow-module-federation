// @flow
import * as React from 'react';
import type { OrderPayload, ShipmentPayload } from 'generated/graphql';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';
import { areEqual } from 'react-window';
import orderRenderer from 'modules/relationMapV2/components/OrderFocus/cellRenderer';
import LoadMorePlaceholder from 'modules/relationMapV2/components/LoadMorePlaceholder';
import { RowStyle } from 'modules/relationMapV2/components/Row/style';

type Props = {
  index: number,
  style: Object,
  // eslint-disable-next-line flowtype/generic-spacing
  data: Array<
    Array<{
      cell: ?CellRender,
      onClick: Function,
      order?: OrderPayload,
      shipment?: ShipmentPayload,
      isExpand: boolean,
    }>
  >,
};

class OrderFocusedRow extends React.PureComponent<Props> {
  render() {
    const { index, style, data } = this.props;
    const cells = data[index];
    if (!data[index]) {
      return (
        <div className={RowStyle} style={style}>
          <LoadMorePlaceholder />
        </div>
      );
    }
    return (
      <div className={RowStyle} style={style}>
        {cells.map(({ cell, order, shipment, onClick, isExpand }) =>
          orderRenderer(cell, {
            onClick,
            isExpand,
            order,
            shipment,
          })
        )}
      </div>
    );
  }
}

export default React.memo<Props>(OrderFocusedRow, areEqual);
