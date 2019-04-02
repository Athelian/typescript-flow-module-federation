// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { Display } from 'components/Form';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import QuantityChartMini from 'components/QuantityChartMini';
import {
  RMOrderItemCardWrapperStyle,
  ProductImageStyle,
  InfoWrapperStyle,
  NameWrapperStyle,
  SerialWrapperStyle,
  ChartWrapperStyle,
} from './style';

type Props = {
  orderItem: {
    productProvider: {
      product: {
        name: string,
        serial: string,
        files: Array<{
          pathSmall: string,
        }>,
      },
    },
    orderedQuantity: number,
    batchedQuantity: number,
    shippedQuantity: number,
    batched: number,
    shipped: number,
  },
};

export default class RMOrderItemCard extends React.PureComponent<Props> {
  render() {
    const {
      orderItem: {
        productProvider: {
          product: { name, serial, files },
        },
        orderedQuantity,
        batchedQuantity,
        shippedQuantity,
        batched,
        shipped,
      },
    } = this.props;

    const productImage = files && files.length > 0 ? files[0].pathSmall : FALLBACK_IMAGE;

    return (
      <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" actions={[]}>
        <div className={RMOrderItemCardWrapperStyle}>
          <img className={ProductImageStyle} src={productImage} alt="product_image" />

          <div className={InfoWrapperStyle}>
            <div className={NameWrapperStyle}>
              <Display align="left">{name}</Display>
            </div>

            <div className={SerialWrapperStyle}>{serial}</div>
          </div>

          <div className={ChartWrapperStyle}>
            <QuantityChartMini
              orderedQuantity={orderedQuantity}
              batchedQuantity={batchedQuantity}
              shippedQuantity={shippedQuantity}
              batched={batched}
              shipped={shipped}
            />
          </div>
        </div>
      </BaseCard>
    );
  }
}
