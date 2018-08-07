// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { type Product } from 'modules/product/type.js.flow';
import messages from 'modules/product/messages';
import EntityCard from 'components/EntityCard';
import Icon from 'components/Icon';
import FallbackImage from 'media/logo_fallback.jpg';
import {
  ProductItemStyle,
  ImageStyle,
  TagsWrapperStyle,
  TagStyle,
  NameStyle,
  SerialStyle,
  ExporterStyle,
  SupplierStyle,
  IconStyle,
  MoreStyle,
  HiddenStyle,
  // CopyButtonWrapperStyle,
  ProductItemWrapperStyle,
} from './style';

type Props = {
  product: ?Product,
  intl: intlShape,
};

const ProductItem = ({ product, intl }: Props) => {
  if (!product) return '';

  const { name, serial, exporterSuppliers, files, tags } = product;
  const { exporter, supplier } = exporterSuppliers[exporterSuppliers.length - 1];
  const isPesMultiple = exporterSuppliers.length > 1;

  const image =
    files.length > 0 ? `${process.env.ZENPORT_FS_URL || ''}/${files[0].path}` : FallbackImage;

  return (
    <div className={ProductItemWrapperStyle}>
      <EntityCard color="RED" icon="fasShip">
        <div className={ProductItemStyle}>
          <img src={image} alt={name} className={ImageStyle} />
          <div className={NameStyle} title={intl.formatMessage(messages.tooltipName, { name })}>
            <b>{name}</b>
          </div>
          <div
            className={SerialStyle}
            title={intl.formatMessage(messages.tooltipSerial, { serial })}
          >
            {serial}
          </div>
          <div
            className={ExporterStyle}
            title={intl.formatMessage(messages.tooltipExporter, { exporter: exporter.name })}
          >
            <div className={IconStyle}>
              <Icon icon="faExporter" />
            </div>
            <div className={isPesMultiple ? MoreStyle : `${MoreStyle} ${HiddenStyle}`}>
              <Icon icon="faMore" />
            </div>
            {exporter.name}
          </div>
          <div
            className={SupplierStyle}
            title={intl.formatMessage(messages.tooltipSupplier, {
              supplier: (supplier && supplier.name) || '',
            })}
          >
            <div className={IconStyle}>
              <Icon icon="faSupplier" />
            </div>
            <div className={isPesMultiple ? MoreStyle : `${MoreStyle} ${HiddenStyle}`}>
              <Icon icon="faMore" />
            </div>
            {(supplier && supplier.name) || ''}
          </div>
          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <div className={TagStyle(tag.color)} key={tag.id}>
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      </EntityCard>
      {/* <div className={CopyButtonWrapperStyle}>
        <CopyButton to={{ pathname: '/product/new', state: { sourceProductId: id } }} />
      </div> */}
    </div>
  );
};

export default injectIntl(ProductItem);
