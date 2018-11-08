// @flow
import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { getByPathWithDefault as get } from 'utils/fp';
import {
  ProgressIconStyle,
  BarStyle,
  ProgressBarStyle,
  NumberLineStyle,
  CenterTopNumberStyle,
  BatchedBadgeStyle,
  ShippedBadgeStyle,
  SerialWrapperStyle,
  ProductNameWrapperStyle,
} from '../Card/style';
import { CardWrapperStyle, CardVisualizeStyle, CardTitleStyle } from '../style';
import Number from '../Card/Number';
import Badge from '../Card/Badge';
// import messages from './messages';

type Props = {
  orderItem: {
    name: string | React.Node,
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched?: number,
    shipped?: number,
    productProvider: Object,
  },
};

export default class OrderItemCard extends React.PureComponent<Props> {
  render() {
    const {
      orderItem: {
        name,
        orderedQuantity,
        batchedQuantity,
        shippedQuantity,
        batched,
        shipped,
        productProvider,
      },
    } = this.props;
    return (
      <div className={CardWrapperStyle}>
        <div className={ProductNameWrapperStyle}>
          <div className={CardTitleStyle}>{name}</div>
          <div className={SerialWrapperStyle}>{get('', 'product.serial', productProvider)}</div>
        </div>

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
