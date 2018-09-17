// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Product } from 'modules/product/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { ProductCardWrapperStyle } from './style';

type OptionalProps = {
  onClick?: (id: string) => void,
  selectable: boolean,
};

type Props = OptionalProps & {
  product: ?Product,
};

const defaultProps = {
  selectable: false,
  onClick: id => navigate(`/product/${encodeId(id)}`),
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

  return (
    <BaseCard icon="PRODUCT" color="PRODUCT" actions={actions} selectable={selectable} {...rest}>
      <div className={ProductCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </BaseCard>
  );
};

ProductCard.defaultProps = defaultProps;

export default ProductCard;
