// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display, FormTooltip } from 'components/Form';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
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
  ProductExporterStyle,
  ProductSupplierStyle,
  ProductTagsWrapperStyle,
  ProductPriceStyle,
} from './style';

type OptionalProps = {
  onClick?: ?Function,
  selectable: boolean,
  selected: boolean,
  orderCurrency?: string,
};

type Props = OptionalProps & {
  productProvider: ?Object,
};

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

    if (!productProvider) return '';

    const actions = [];

    const {
      product: { name, serial, tags, files },
      unitPrice,
    } = productProvider;

    if (orderCurrency && unitPrice && orderCurrency !== unitPrice.currency) {
      actions.push(
        <FormTooltip
          infoMessage={
            <FormattedMessage
              id="components,cards.currencyDifferentWarningMessage"
              defaultMessage="The Unit Price will not be automatically synced into the Item because the Currency of the Unit Price of this End Product does not match the Currency of this Order."
            />
          }
        />
      );
    }

    const productImage = files && files.length > 0 ? files[activeImage].pathMedium : FALLBACK_IMAGE;

    return (
      <BaseCard
        icon="PROVIDER"
        color="PROVIDER"
        actions={actions}
        selectable={selectable}
        forceShowActions={rest.selected}
        {...rest}
      >
        <div className={ProductProviderCardWrapperStyle} onClick={onClick} role="presentation">
          <div className={ProductImageWrapperStyle}>
            <img className={ProductImageStyle} src={productImage} alt="product_image" />
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
              <div className={ProductExporterStyle}>
                <Icon icon="EXPORTER" />
                {productProvider.exporter.name}
              </div>
              <div className={ProductSupplierStyle}>
                <Icon icon="SUPPLIER" />
                {productProvider.supplier && productProvider.supplier.name}
              </div>
            </div>
            <div className={ProductTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </div>
      </BaseCard>
    );
  }
}

export default OrderProductProviderCard;
