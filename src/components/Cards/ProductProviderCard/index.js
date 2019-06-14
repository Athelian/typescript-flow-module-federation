// @flow
import React from 'react';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import TaskRing from 'components/TaskRing';
import { Display } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ProductProviderCardWrapperStyle,
  InfoWrapperStyle,
  NameStyle,
  ExporterStyle,
  SupplierStyle,
  TaskWrapperStyle,
} from './style';

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
  const { archived, name, exporter, supplier, referenced, todo } = productProvider;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => onClone(productProvider)} />,
        referenced ? null : (
          <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(productProvider)} />
        ),
      ].filter(Boolean);

  return (
    <BaseCard
      icon="PRODUCT_PROVIDER"
      color="PRODUCT_PROVIDER"
      selectable={selectable}
      actions={actions}
      isArchived={archived}
      {...rest}
    >
      <div className={ProductProviderCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={NameStyle}>
          <Display align="left">{name}</Display>
        </div>

        <div className={InfoWrapperStyle}>
          <div className={ExporterStyle}>
            <Icon icon="EXPORTER" />
            {exporter && exporter.name}
          </div>

          <div className={SupplierStyle}>
            <Icon icon="SUPPLIER" />
            {supplier && supplier.name}
          </div>

          <div className={TaskWrapperStyle}>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ProductProviderCard.defaultProps = defaultProps;

export default withForbiddenCard(ProductProviderCard, 'productProvider', {
  width: '195px',
  height: '106px',
  entityIcon: 'PRODUCT_PROVIDER',
  entityColor: 'PRODUCT_PROVIDER',
});
