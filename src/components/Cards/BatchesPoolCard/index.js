// @flow
import * as React from 'react';
import type { ProductPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ProductImage from 'components/ProductImage';
import { getByPath } from 'utils/fp';
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
  product: ProductPayload,
};

const defaultProps = {
  product: null,
};

const BatchesPoolCard = ({ totalBatches, product }: Props) => {
  return (
    <BaseCard icon="BATCH" color="BATCH">
      <div className={BatchesPoolCardWrapperStyle} role="presentation">
        <ProductImage
          className={ProductImageStyle}
          height="80px"
          file={getByPath('files.0', product)}
        />

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
