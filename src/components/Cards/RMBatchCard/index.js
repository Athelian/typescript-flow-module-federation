// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseCard from 'components/Cards';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Label } from 'components/Form';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import {
  RMBatchCardWrapperStyle,
  ProductImageStyle,
  InfoWrapperStyle,
  NameWrapperStyle,
  DeliveryWrapperStyle,
  DataWrapperStyle,
  DataRowStyle,
} from './style';

type Props = {
  batch: {
    no: string,
    batchedQuantity: number,
    totalVolume: ?{
      value: number,
      metric: string,
    },
    deliveredAt: ?string,
  },
  product: {
    files: Array<{
      pathSmall: string,
    }>,
  },
};

export default class RMBatchCard extends React.PureComponent<Props> {
  render() {
    const {
      batch: { no, batchedQuantity, totalVolume, deliveredAt },
      product: { files },
    } = this.props;

    const productImage = files && files.length > 0 ? files[0].pathSmall : FALLBACK_IMAGE;

    return (
      <BaseCard icon="BATCH" color="BATCH" actions={[]}>
        <div className={RMBatchCardWrapperStyle}>
          <div className={InfoWrapperStyle}>
            <div className={NameWrapperStyle}>
              <Display align="left">{no}</Display>
            </div>

            <div className={DeliveryWrapperStyle}>
              <Label>
                <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
              </Label>
              {deliveredAt ? (
                <FormattedDate value={deliveredAt} />
              ) : (
                <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
              )}
            </div>
          </div>

          <div className={DataWrapperStyle}>
            <div className={DataRowStyle}>
              <Label>
                <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
              </Label>
              <Display align="left">
                <FormattedNumber value={batchedQuantity} />
              </Display>
            </div>

            <div className={DataRowStyle}>
              <Label>
                <FormattedMessage id="components.cards.vol" defaultMessage="VOL" />
              </Label>
              <Display align="left">
                {totalVolume ? (
                  <>
                    <FormattedNumber value={totalVolume.value} />
                    {` ${totalVolume.metric}`}
                  </>
                ) : (
                  <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
                )}
              </Display>
            </div>
          </div>

          <img className={ProductImageStyle} src={productImage} alt="product_image" />
        </div>
      </BaseCard>
    );
  }
}
