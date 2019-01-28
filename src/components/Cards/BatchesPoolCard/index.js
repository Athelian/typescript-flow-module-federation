// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { getProductImage } from 'components/Cards/utils';
import { BATCHES_POOL } from 'modules/shipment/helpers';
import BaseCard from '../BaseCard';
import {
  BatchesPoolCardWrapperStyle,
  ProductImageStyle,
  InfoWrapperStyle,
  TitleStyle,
  DescriptionStyle,
  TotalBatchesWrapperStyle,
  TotalBatchesLabelStyle,
  TotalBatchesStyle,
} from './style';

type Props = {
  totalBatches: number,
  product: ?Object,
  setSelectedContainerId: string => void,
};

const defaultProps = {
  product: null,
};

const BatchesPoolCard = ({ totalBatches, product, setSelectedContainerId }: Props) => {
  const productImage = getProductImage(product);

  return (
    <BaseCard icon="BATCH" color="BATCH">
      <div
        className={BatchesPoolCardWrapperStyle}
        onClick={() => setSelectedContainerId(BATCHES_POOL)}
        role="presentation"
      >
        <img className={ProductImageStyle} src={productImage} alt="product_image" />

        <div className={InfoWrapperStyle}>
          <div className={TitleStyle}>
            <FormattedMessage id="components.cards.batchesPool" defaultMessage="Batches Pool" />
          </div>
          <div className={DescriptionStyle}>
            <FormattedMessage
              id="components.cards.batchesPoolDescription"
              defaultMessage="Batches that are not in Containers"
            />
          </div>
          <div className={TotalBatchesWrapperStyle}>
            <div className={TotalBatchesLabelStyle}>
              <FormattedMessage id="components.cards.totalBatches" defaultMessage="TOTAL BATCHES" />
            </div>
            <div className={TotalBatchesStyle}>
              <FormattedNumber value={totalBatches} />
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

BatchesPoolCard.defaultProps = defaultProps;

export default BatchesPoolCard;
