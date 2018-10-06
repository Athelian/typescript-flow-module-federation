// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { isEquals, isDataType } from 'utils/fp';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { SectionWrapper, SectionHeader, LastModified, StatusToggle } from 'components/Form';
import { Subscribe } from 'unstated';
import { FormContainer } from 'modules/form';
import { ProductSection, ProductProvidersSection } from './components';
import { ProductFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  onDetailReady: () => void,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNew: false,
  onDetailReady: () => {},
};
class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { product } = this.props;

    return !isEquals(product, nextProps.product);
  }

  render() {
    const { product, isNew } = this.props;
    const { updatedAt, updatedBy, archived } = product;

    return (
      <div className={ProductFormWrapperStyle}>
        <SectionWrapper id="productSection">
          <SectionHeader
            icon="PRODUCT"
            title={<FormattedMessage id="modules.product.product" defaultMessage="PRODUCT" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                <BooleanValue>
                  {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                    <StatusToggle
                      archived={archived}
                      openStatusDialog={() => dialogToggle(true)}
                      activateDialog={
                        <ProductActivateDialog
                          product={product}
                          isOpen={statusDialogIsOpen && !!archived}
                          onRequestClose={() => dialogToggle(false)}
                          onConfirm={() => window.location.reload()}
                        />
                      }
                      archiveDialog={
                        <ProductArchiveDialog
                          product={product}
                          isOpen={statusDialogIsOpen && !archived}
                          onRequestClose={() => dialogToggle(false)}
                          onConfirm={() => window.location.reload()}
                        />
                      }
                    />
                  )}
                </BooleanValue>
              </>
            )}
          </SectionHeader>
          <ProductSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="productProvidersSection">
          <SectionHeader
            icon="PROVIDER"
            title={<FormattedMessage id="modules.product.providers" defaultMessage="PROVIDERS" />}
          />
          <Subscribe to={[FormContainer]}>
            {({ state: { touched, errors } }) => {
              const errorMessage: ?string | ?Object = errors.productProviders;
              if (errorMessage && touched.productProviders) {
                if (isDataType(Object, errorMessage)) {
                  const [topErrorMessage]: Array<string> = Object.values(errorMessage);
                  return <p>{topErrorMessage}</p>;
                }

                return <p>{errorMessage}</p>;
              }

              return '';
            }}
          </Subscribe>
          <ProductProvidersSection />
        </SectionWrapper>
      </div>
    );
  }
}

export default ProductForm;
