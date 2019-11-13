// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, FormTooltip } from 'components/Form';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import withForbiddenCard from 'hoc/withForbiddenCard';
import TaskRing from 'components/TaskRing';
import ProductImage from 'components/ProductImage';
import BaseCard from '../BaseCard';
import {
  ProductProviderCardWrapperStyle,
  ProductImageWrapperStyle,
  ProductImageStyle,
  ProductImageChevronButtonStyle,
  ProductImageDotsWrapperStyle,
  ProductImageDotStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductProvidersWrapperStyle,
  ProductProviderNameStyle,
  ProductImporterStyle,
  ProductExporterStyle,
  ProductSupplierStyle,
  TagsAndTaskWrapperStyle,
  ProductTagsWrapperStyle,
  ProductPriceStyle,
} from './style';

type Props = {|
  onClick?: ?Function,
  selectable: boolean,
  selected: boolean,
  orderCurrency?: string,
  productProvider: Object,
|};

type State = {
  activeImage: number,
};

const defaultProps = {
  selectable: false,
  selected: false,
};

class OrderProductProviderCard extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  state = {
    activeImage: 0,
  };

  navigateImages = (direction: 'left' | 'right') => {
    const { productProvider } = this.props;
    const { activeImage } = this.state;

    if (productProvider) {
      if (direction === 'left') {
        if (activeImage > 0) this.setState({ activeImage: activeImage - 1 });
      } else if (direction === 'right') {
        if (activeImage < productProvider.product.files.length - 1)
          this.setState({ activeImage: activeImage + 1 });
      }
    }
  };

  render() {
    const { productProvider, onClick, selectable, orderCurrency, ...rest } = this.props;
    const { activeImage } = this.state;

    const actions = [];

    const {
      archived,
      product: { name, serial, tags, files, importer },
      unitPrice,
      todo,
    } = productProvider;

    if (orderCurrency && unitPrice && orderCurrency !== unitPrice.currency) {
      actions.push(
        <FormTooltip
          infoMessage={
            <FormattedMessage
              id="components.cards.currencyDifferentWarningMessage"
              defaultMessage="The Unit Price will not be automatically synced into the Item because the Currency of the Unit Price of this End Product does not match the Currency of this Order."
            />
          }
        />
      );
    }

    return (
      <BaseCard
        icon="PRODUCT_PROVIDER"
        color="PRODUCT_PROVIDER"
        actions={actions}
        selectable={selectable}
        forceShowActions={rest.selected}
        isArchived={archived}
        {...rest}
      >
        <div className={ProductProviderCardWrapperStyle} onClick={onClick} role="presentation">
          <div className={ProductImageWrapperStyle}>
            <ProductImage height="75px" className={ProductImageStyle} file={files[activeImage]} />
            {files && activeImage > 0 && (
              <button
                className={ProductImageChevronButtonStyle('left')}
                onClick={evt => {
                  evt.preventDefault();
                  this.navigateImages('left');
                }}
                type="button"
              >
                <Icon icon="ANGLE_LEFT" />
              </button>
            )}
            {files && activeImage < files.length - 1 && (
              <button
                className={ProductImageChevronButtonStyle('right')}
                onClick={evt => {
                  evt.preventDefault();
                  this.navigateImages('right');
                }}
                type="button"
              >
                <Icon icon="ANGLE_RIGHT" />
              </button>
            )}
            <div className={ProductImageDotsWrapperStyle}>
              {files &&
                files.length > 1 &&
                files.map((file, index) => (
                  <div className={ProductImageDotStyle(activeImage === index)} key={file.id} />
                ))}
            </div>
          </div>

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameStyle}>{name}</div>
            <div className={ProductSerialStyle}>{serial}</div>
            <div className={ProductPriceStyle}>
              <Label>
                <FormattedMessage id="modules.Orders.price" defaultMessage="Unit Price" />
              </Label>
              <Display>
                <FormattedNumber
                  value={unitPrice && unitPrice.amount}
                  suffix={unitPrice && unitPrice.currency}
                />
              </Display>
            </div>
            <div className={ProductProvidersWrapperStyle}>
              <div className={ProductProviderNameStyle}>{productProvider.name}</div>
              <div className={ProductImporterStyle}>
                <Icon icon="IMPORTER" />
                {importer && importer.name}
              </div>
              <div className={ProductExporterStyle}>
                <Icon icon="EXPORTER" />
                {productProvider.exporter.name}
              </div>
              <div className={ProductSupplierStyle}>
                <Icon icon="SUPPLIER" />
                {productProvider.supplier && productProvider.supplier.name}
              </div>
            </div>

            <div className={TagsAndTaskWrapperStyle}>
              <div className={ProductTagsWrapperStyle}>
                {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
              </div>
              <TaskRing {...todo} />
            </div>
          </div>
        </div>
      </BaseCard>
    );
  }
}

export default withForbiddenCard(OrderProductProviderCard, 'productProvider', {
  width: '195px',
  height: '284px',
  entityIcon: 'PRODUCT_PROVIDER',
  entityColor: 'PRODUCT_PROVIDER',
});
