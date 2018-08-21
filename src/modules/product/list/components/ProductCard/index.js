// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Product } from 'modules/product/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { ProductCardWrapperStyle } from './style';

type Props = {
  product: ?Product,
  onClick?: (id: string) => void,
};

const defaultProps = {
  onClick: id => navigate(`/product/${encodeId(id)}`),
};

const ProductCard = ({ product, onClick }: Props) => {
  if (!product) return '';

  const { id } = product;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="PRODUCT" color="PRODUCT" actions={actions}>
      <div className={ProductCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </EntityCard>
  );
};

ProductCard.defaultProps = defaultProps;

export default ProductCard;
