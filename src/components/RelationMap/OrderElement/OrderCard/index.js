// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  ProgressIconStyle,
  BarStyle,
  ProgressBarStyle,
  NumberLineStyle,
  CenterTopNumberStyle,
  BatchedBadgeStyle,
  ShippedBadgeStyle,
} from '../Card/style';
import { CardWrapperStyle, CardVisualizeStyle, CardTitleStyle } from '../style';
import Number from '../Card/Number';
import Badge from '../Card/Badge';

type Props = {
  order: {
    poNo: string | React.Node,
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched?: number,
    shipped?: number,
  },
};
export default class OrderCard extends React.PureComponent<Props> {
  render() {
    const {
      order: { poNo, orderedQuantity, batchedQuantity, shippedQuantity, batched, shipped },
    } = this.props;
    return (
      <div className={CardWrapperStyle}>
        <div className={CardTitleStyle}>{poNo}</div>
        <div className={CardVisualizeStyle}>
          {/* number in middle */}
          <div className={NumberLineStyle}>
            <span className={CenterTopNumberStyle}>
              <Number color="BLACK" value={orderedQuantity} />
            </span>
          </div>

          {/* batch visualize */}
          <div className={BarStyle}>
            <div
              className={ProgressBarStyle(
                'BATCH',
                orderedQuantity === 0 ? 0 : batchedQuantity / orderedQuantity
              )}
            >
              <div className={ProgressIconStyle}>
                <Icon icon="BATCH" />
              </div>

              {batched && (
                <div className={BatchedBadgeStyle}>
                  <Badge value={batched} color="BATCH" />
                </div>
              )}
            </div>
          </div>

          {/* shipped visualize */}
          <div className={BarStyle}>
            <div
              className={ProgressBarStyle(
                'SHIPMENT',
                orderedQuantity === 0 ? 0 : shippedQuantity / orderedQuantity
              )}
            >
              <div className={ProgressIconStyle}>
                <Icon icon="SHIPMENT" />
              </div>

              {shipped && (
                <div className={ShippedBadgeStyle}>
                  <Badge value={shipped} color="SHIPMENT" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
