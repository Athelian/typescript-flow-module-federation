// @flow
import React from 'react';
import { navigate } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { ProductCardWrapperStyle } from './style';

type OptionalProps = {
  onClick?: ?Function,
  selectable: boolean,
};

type Props = OptionalProps & {
  product: ?Object,
};

const defaultProps = {
  selectable: false,
};

const ProductCard = ({ product, onClick, selectable, ...rest }: Props) => {
  if (!product) return '';

  const { id } = product;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
        <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
        <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
      ];

  const defaultOnClick = () => navigate(`/product/${encodeId(id)}`);

  return (
    <BaseCard icon="PRODUCT" color="PRODUCT" actions={actions} selectable={selectable} {...rest}>
      <div
        className={ProductCardWrapperStyle}
        onClick={onClick || defaultOnClick}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

ProductCard.defaultProps = defaultProps;

export default ProductCard;
