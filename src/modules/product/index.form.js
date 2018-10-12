// @flow
import * as React from 'react';
import { omit, set, lensProp } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId } from 'utils/id';
import {
  ProductInfoContainer,
  ProductProvidersContainer,
  ProductTagsContainer,
} from './form/containers';
import ProductForm from './form';
import validator from './form/validator';
import { productFormQuery } from './form/query';
import {
  createProductMutation,
  prepareCreateProductInput,
  updateProductMutation,
  prepareUpdateProductInput,
} from './form/mutation';

type OptionalProps = {
  isSlideView: boolean,
};

type Props = OptionalProps & {
  path: string,
  productId?: string,
};

const defaultProps = {
  path: '',
  productId: '',
  isSlideView: false,
};

type CreateProductResponse = {|
  productCreate: {
    violations: ?Array<Object>,
    product: ?{
      id: string,
    },
  },
|};

type UpdateProductResponse = {|
  productUpdate: {
    violations: ?Array<Object>,
    product: ?{
      id: string,
    },
  },
|};

const cleanUpCloneProductInput = (originalProduct: any) => {
  const { productProviders: originalProductProviders } = originalProduct;
  const productProviders = originalProductProviders.map(item =>
    omit(['id', 'archived', 'updatedBy'], item)
  );
  const product = omit(['archived', 'files', 'productProviders'], originalProduct);
  return set(lensProp('productProviders'), productProviders, product);
};

class ProductFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/product`);
  };

  onSave = async (
    formData: Object,
    saveProduct: any => Promise<?{ data?: CreateProductResponse | UpdateProductResponse }>,
    onSuccess: () => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { productId } = this.props;

    const isNew = this.isNew();
    const input = isNew ? prepareCreateProductInput(formData) : prepareUpdateProductInput(formData);

    if (isNew) {
      const result = await saveProduct({
        variables: { input },
      });
      if (result && result.data) {
        const { data } = result;
        if (data.productCreate) {
          const {
            productCreate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess();
          }
        }
      }
    } else if (productId) {
      const result = await saveProduct({ variables: { input, id: decodeId(productId) } });
      if (result && result.data) {
        const { data } = result;
        if (data.productUpdate) {
          const {
            productUpdate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess();
          }
        }
      }
    }
  };

  onMutationCompleted = (result: CreateProductResponse | UpdateProductResponse) => {
    if (this.isNew() && result.productCreate) {
      const {
        productCreate: { product, violations },
      } = result;

      if (!violations) {
        if (product && product.id) {
          navigate(`/product/${encodeId(product.id)}`);
        }
      }
    }
  };

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new') || path.startsWith('clone');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  render() {
    const { productId, isSlideView } = this.props;
    const isNew = this.isNew();
    let mutationKey = {};
    if (productId && !isNew) {
      mutationKey = { key: decodeId(productId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createProductMutation : updateProductMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveProduct, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...(isSlideView ? {} : uiState)}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="PRODUCT" color="PRODUCT" />
                      <JumpToSection>
                        <SectionTabs
                          link="productSection"
                          label={
                            <FormattedMessage
                              id="modules.product.product"
                              defaultMessage="PRODUCT"
                            />
                          }
                          icon="PRODUCT"
                        />
                        <SectionTabs
                          link="productProvidersSection"
                          label={
                            <FormattedMessage
                              id="modules.product.providers"
                              defaultMessage="END PRODUCTS"
                            />
                          }
                          icon="PROVIDER"
                        />
                      </JumpToSection>
                      <Subscribe
                        to={[
                          ProductInfoContainer,
                          ProductProvidersContainer,
                          ProductTagsContainer,
                          FormContainer,
                        ]}
                      >
                        {(productInfoState, productProvidersState, productTagsState, form) =>
                          (isNew ||
                            productInfoState.isDirty() ||
                            productProvidersState.isDirty() ||
                            productTagsState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...productInfoState.state,
                                      ...productProvidersState.state,
                                      ...productTagsState.state,
                                    },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...productInfoState.state,
                                      ...productProvidersState.state,
                                      ...productTagsState.state,
                                    },
                                    saveProduct,
                                    () => {
                                      productInfoState.onSuccess();
                                      productProvidersState.onSuccess();
                                      productTagsState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
                            </>
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {!productId ? (
                    <ProductForm product={{}} isNew />
                  ) : (
                    <QueryForm
                      query={productFormQuery}
                      entityId={productId}
                      entityType="product"
                      render={originalProduct => {
                        const product = cleanUpCloneProductInput(originalProduct);

                        return (
                          <Subscribe
                            to={[
                              ProductInfoContainer,
                              ProductProvidersContainer,
                              ProductTagsContainer,
                            ]}
                          >
                            {(productInfoState, productProvidersState, productTagsState) => (
                              <ProductForm
                                isNew={isNew}
                                product={product}
                                onFormReady={() => {
                                  const { tags, productProviders, ...info } = product;
                                  productInfoState.initDetailValues(info);
                                  productProvidersState.initDetailValues(productProviders);
                                  productTagsState.initDetailValues(tags);
                                }}
                              />
                            )}
                          </Subscribe>
                        );
                      }}
                    />
                  )}
                </Layout>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default ProductFormModule;
