// @flow
import * as React from 'react';
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
} from './style';

type OptionalProps = {
  onClick?: ?Function,
  selectable: boolean,
};

type Props = OptionalProps & {
  productProvider: ?Object,
};

type State = {
  activeImage: number,
};

const defaultProps = {
  selectable: false,
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
    const { productProvider, onClick, selectable, ...rest } = this.props;
    const { activeImage } = this.state;

    if (!productProvider) return '';

    const actions = [];

    const {
      product: { name, serial, tags, files },
    } = productProvider;

    const productImage = files && files.length > 0 ? files[activeImage].path : FALLBACK_IMAGE;

    return (
      <BaseCard
        icon="PROVIDER"
        color="PROVIDER"
        actions={actions}
        selectable={selectable}
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
