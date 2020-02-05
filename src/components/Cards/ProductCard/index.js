// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import TaskRing from 'components/TaskRing';
import ProductImage from 'components/ProductImage';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  ProductCardWrapperStyle,
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
  MoreProviderBadge,
  ProductTagsWrapperStyle,
  TagsAndTaskWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
  onClick: Function,
};

type Props = OptionalProps & {
  product: Object,
};

type State = {
  activeImage: number,
};

const defaultProps = {
  actions: [],
};

class ProductCard extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

  state = {
    activeImage: 0,
  };

  navigateImages = (direction: 'left' | 'right') => {
    const { product } = this.props;
    const { activeImage } = this.state;

    if (product) {
      if (direction === 'left') {
        if (activeImage > 0) this.setState({ activeImage: activeImage - 1 });
      } else if (direction === 'right') {
        if (activeImage < product.files.length - 1) this.setState({ activeImage: activeImage + 1 });
      }
    }
  };

  render() {
    const { product, actions, onClick, ...rest } = this.props;
    const { activeImage } = this.state;
    const { archived, name, serial, tags, files = [], productProviders, todo, importer } = product;

    return (
      <BaseCard
        icon="PRODUCT"
        color="PRODUCT"
        actions={actions}
        isArchived={archived}
        showBadge={product?.notificationUnseenCount === 0}
        {...rest}
      >
        <div className={ProductCardWrapperStyle} onClick={onClick} role="presentation">
          <div className={ProductImageWrapperStyle}>
            <ProductImage height="75px" className={ProductImageStyle} file={files[activeImage]} />
            {files && files.length > 1 && (
              <>
                <button
                  className={ProductImageChevronButtonStyle('left', activeImage === 0)}
                  onClick={evt => {
                    evt.preventDefault();
                    this.navigateImages('left');
                  }}
                  type="button"
                >
                  <Icon icon="ANGLE_LEFT" />
                </button>
                <button
                  className={ProductImageChevronButtonStyle(
                    'right',
                    activeImage === files.length - 1
                  )}
                  onClick={evt => {
                    evt.preventDefault();
                    this.navigateImages('right');
                  }}
                  type="button"
                >
                  <Icon icon="ANGLE_RIGHT" />
                </button>
              </>
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
                <Icon icon="IMPORTER" />
                {importer && importer.name}
              </div>
              <div className={ProductExporterStyle}>
                <Icon icon="EXPORTER" />
                {productProviders.length > 0 && productProviders[0].exporter.name}
              </div>
              <div className={ProductSupplierStyle}>
                <Icon icon="SUPPLIER" />
                {productProviders.length > 0 &&
                  productProviders[0].supplier &&
                  productProviders[0].supplier.name}
              </div>
              {productProviders.length > 1 && (
                <div className={MoreProviderBadge}>
                  + <FormattedNumber value={productProviders.length - 1} />
                </div>
              )}
            </div>
            <div className={TagsAndTaskWrapperStyle}>
              <div className={ProductTagsWrapperStyle}>
                {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
              </div>
              <TaskRing {...todo} />
            </div>
          </div>
        </div>
      </BaseCard>
    );
  }
}

export default withForbiddenCard(ProductCard, 'product', {
  width: '195px',
  height: '227px',
  entityIcon: 'PRODUCT',
  entityColor: 'PRODUCT',
});
