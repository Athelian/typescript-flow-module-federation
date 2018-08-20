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
};

const ProductCard = ({ product }: Props) => {
  if (!product) return '';

  const { id } = product;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="PRODUCT" color="PRODUCT" actions={actions}>
      <div
        className={ProductCardWrapperStyle}
        onClick={() => navigate(`/product/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default ProductCard;
