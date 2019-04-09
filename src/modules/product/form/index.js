// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { isEquals, isDataType } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { ProductSection, ProductProvidersSection } from './components';
import { ProductFormWrapperStyle } from './style';

type OptionalProps = {
  isNewOrClone: boolean,
  isOwner: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNewOrClone: false,
  isOwner: true,
  onFormReady: () => {},
};

class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { product, isOwner } = this.props;

    return !isEquals(product, nextProps.product) || nextProps.isOwner !== isOwner;
  }

  componentDidUpdate() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { isNewOrClone, isOwner, product } = this.props;

    return (
      <div className={ProductFormWrapperStyle}>
        <SectionWrapper id="product_productSection">
          <ProductSection isOwner={isOwner} isNew={isNewOrClone} product={product} />
        </SectionWrapper>

        <SectionWrapper id="product_productProvidersSection">
          <SectionHeader
            icon="PRODUCT_PROVIDER"
            title={
              <FormattedMessage id="modules.Products.providers" defaultMessage="END PRODUCTS" />
            }
          />
          <Subscribe to={[FormContainer]}>
            {({ state: { touched, errors } }) => {
              // TODO: better UI for server side error message
              const errorMessage: ?string | ?Object = errors.productProviders;
              if (errorMessage && touched.productProviders) {
                if (isDataType(Object, errorMessage)) {
                  const [topErrorMessage]: Array<any> = Object.values(errorMessage);
                  return <p>{topErrorMessage}</p>;
                }
                return <p>{errorMessage}</p>;
              }
              return '';
            }}
          </Subscribe>
          <ProductProvidersSection isOwner={isOwner} />
        </SectionWrapper>
      </div>
    );
  }
}

export default ProductForm;
