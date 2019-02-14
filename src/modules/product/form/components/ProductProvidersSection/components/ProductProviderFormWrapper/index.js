// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import NoPermission from 'components/NoPermission';
import { PermissionConsumer } from 'modules/permission';
import { contains, getByPathWithDefault } from 'utils/fp';

type OptionalProps = {
  isAddedProvider: boolean,
};

type Props = OptionalProps & {
  productProviders: Array<Object>,
  productProvider: Object,
  isNew: boolean,
  initDetailValues: Function,
  onSave: Function,
  onCancel: Function,
};

const defaultProps = {
  isAddedProvider: false,
};

const formContainer = new FormContainer();

function isExist(
  productProvider: Object,
  productProviders: Array<Object>,
  isAddedProvider: boolean
): boolean {
  const provider = {
    exporter: getByPathWithDefault(0, 'exporter.id', productProvider),
    supplier: getByPathWithDefault(0, 'supplier.id', productProvider),
  };
  const providers = isAddedProvider
    ? productProviders.map(item => ({
        exporter: getByPathWithDefault(0, 'exporter.id', item),
        supplier: getByPathWithDefault(0, 'supplier.id', item),
      }))
    : productProviders
        .filter(item => item.id !== productProvider.id)
        .map(item => ({
          exporter: getByPathWithDefault(0, 'exporter.id', item),
          supplier: getByPathWithDefault(0, 'supplier.id', item),
        }));

  return contains(provider, providers);
}

class ProductProviderFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { productProvider, initDetailValues } = this.props;
    console.log(productProvider);
    initDetailValues(productProvider);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  onReset = (state: Object) => {
    resetFormState(state);
  };

  render() {
    const { isNew, onSave, productProviders, isAddedProvider, onCancel } = this.props;

    return (
      <PermissionConsumer>
        {hasPermission =>
          hasPermission('product.productProviders.get') ? (
            <Provider inject={[formContainer]}>
              <Subscribe to={[ProductProviderContainer]}>
                {formState => (
                  <Layout
                    navBar={
                      <SlideViewNavBar>
                        <EntityIcon icon="PROVIDER" color="PROVIDER" />
                        <JumpToSection>
                          <SectionTabs
                            link="productProvider_productProviderSection"
                            label={
                              <FormattedMessage
                                id="modules.Products.provider"
                                defaultMessage="END PRODUCT"
                              />
                            }
                            icon="PROVIDER"
                          />
                          <SectionTabs
                            link="productProvider_specificationsSection"
                            label={
                              <FormattedMessage
                                id="modules.Products.specifications"
                                defaultMessage="SPECIFICATIONS"
                              />
                            }
                            icon="SPECIFICATIONS"
                          />
                          <SectionTabs
                            link="productProvider_productProviderPackagingSection"
                            label={
                              <FormattedMessage
                                id="modules.Products.packaging"
                                defaultMessage="PACKAGING"
                              />
                            }
                            icon="PACKAGING"
                          />
                          <SectionTabs
                            link="productProvider_documentsSection"
                            label={
                              <FormattedMessage
                                id="modules.Products.documents"
                                defaultMessage="DOCUMENTS"
                              />
                            }
                            icon="DOCUMENT"
                          />
                        </JumpToSection>

                        {isNew ? (
                          <CancelButton onClick={() => onCancel()} />
                        ) : (
                          <ResetButton onClick={() => this.onReset(formState)} />
                        )}

                        <SaveButton
                          data-testid="saveProviderButton"
                          disabled={
                            !formState.isDirty() ||
                            !formContainer.isReady(formState.state, validator) ||
                            isExist(formState.state, productProviders, isAddedProvider)
                          }
                          onClick={() => onSave(formState.state)}
                        />
                      </SlideViewNavBar>
                    }
                  >
                    <ProductProviderForm
                      productProvider={formState.state}
                      isExist={isExist(formState.state, productProviders, isAddedProvider)}
                      isNew={isNew}
                    />
                  </Layout>
                )}
              </Subscribe>
            </Provider>
          ) : (
            <NoPermission />
          )
        }
      </PermissionConsumer>
    );
  }
}

export default ProductProviderFormWrapper;
