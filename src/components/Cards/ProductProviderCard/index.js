// @flow
import React from 'react';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard, { CardAction } from '../BaseCard';
import { ProductProviderCardWrapperStyle, ExporterStyle, SupplierStyle } from './style';

type OptionalProps = {
  onClick: Function,
  onSelect: Function,
  onClone: Function,
  onRemove: Function,
  saveOnBlur: Function,
  selectable: boolean,
};

type Props = OptionalProps & {
  productProvider: Object,
};

const defaultProps = {
  onClick: () => {},
  onSelect: () => {},
  onRemove: () => {},
  onClone: () => {},
  saveOnBlur: () => {},
  selectable: false,
};

const ProductProviderCard = ({
  productProvider,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  selectable,
  ...rest
}: Props) => {
  const { exporter, supplier, referenced } = productProvider;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => onClone(productProvider)} />,
        ...(!referenced
          ? [
              <CardAction
                icon="REMOVE"
                hoverColor="RED"
                onClick={() => onRemove(productProvider)}
              />,
            ]
          : []),
      ];

  return (
    <BaseCard
      icon="PRODUCT_PROVIDER"
      color="PRODUCT_PROVIDER"
      selectable={selectable}
      actions={actions}
      {...rest}
    >
      <div className={ProductProviderCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ExporterStyle}>
          <Icon icon="EXPORTER" />
          {exporter && exporter.name}
        </div>
        <div className={SupplierStyle}>
          <Icon icon="SUPPLIER" />
          {supplier && supplier.name}
        </div>
      </div>
    </BaseCard>
  );
};

ProductProviderCard.defaultProps = defaultProps;

export default withForbiddenCard(ProductProviderCard, 'productProvider', {
  width: '195px',
  height: '100px',
  entityIcon: 'PRODUCT_PROVIDER',
  entityColor: 'PRODUCT_PROVIDER',
});
