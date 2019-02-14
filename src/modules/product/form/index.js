// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import { ProductActivateDialog, ProductArchiveDialog } from 'modules/product/common/Dialog';
import { SectionWrapper, SectionHeader, LastModified, StatusToggle } from 'components/Form';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import { isEquals, isDataType } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { PermissionConsumer } from 'modules/permission';
import { ProductSection, ProductProvidersSection } from './components';
import { ProductFormWrapperStyle } from './style';

type OptionalProps = {
  isNewOrClone: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNewOrClone: false,
  onFormReady: () => {},
};

class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { product } = this.props;

    return !isEquals(product, nextProps.product);
  }

  componentDidUpdate() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  onClone = () => {
    const { product } = this.props;
    navigate(`/product/clone/${encodeId(product.id)}`);
  };

  render() {
    const { product, isNewOrClone } = this.props;
    const { updatedAt, updatedBy, archived } = product;

    return (
      <PermissionConsumer>
        {hasPermission => (
          <div className={ProductFormWrapperStyle}>
            <SectionWrapper id="product_productSection">
              <SectionHeader
                icon="PRODUCT"
                title={<FormattedMessage id="modules.Products.product" defaultMessage="PRODUCT" />}
              >
                {!isNewOrClone && (
                  <>
                    <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                    <BooleanValue>
                      {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                        <StatusToggle
                          readOnly={!hasPermission('product.products.update')}
                          archived={archived}
                          openStatusDialog={() => dialogToggle(true)}
                          activateDialog={
                            <ProductActivateDialog
                              product={product}
                              isOpen={statusDialogIsOpen && !!archived}
                              onRequestClose={() => dialogToggle(false)}
                            />
                          }
                          archiveDialog={
                            <ProductArchiveDialog
                              product={product}
                              isOpen={statusDialogIsOpen && !archived}
                              onRequestClose={() => dialogToggle(false)}
                            />
                          }
                        />
                      )}
                    </BooleanValue>
                    {hasPermission('product.products.create') && (
                      <CloneButton onClick={this.onClone} />
                    )}
                  </>
                )}
              </SectionHeader>
              <ProductSection isNew={isNewOrClone} />
            </SectionWrapper>

            <SectionWrapper id="product_productProvidersSection">
              <SectionHeader
                icon="PROVIDER"
                title={
                  <FormattedMessage id="modules.Products.providers" defaultMessage="END PRODUCTS" />
                }
              />
              <Subscribe to={[FormContainer]}>
                {({ state: { touched, errors } }) => {
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
              <ProductProvidersSection />
            </SectionWrapper>
          </div>
        )}
      </PermissionConsumer>
    );
  }
}

export default ProductForm;
