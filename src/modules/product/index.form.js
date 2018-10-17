// @flow
import * as React from 'react';
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
  ProductFilesContainer,
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
  path: string,
  isSlideView: boolean,
};

type Props = OptionalProps & {
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

const cleanUpCloneProductInput = (product: Object) => ({
  ...product,
  files: [],
  productProviders: product.productProviders.map(
    ({ id, updatedBy, archived, ...productProvider }) => ({
      ...productProvider,
    })
  ),
});

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

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareCreateProductInput(formData)
      : prepareUpdateProductInput(formData);

    if (isNewOrClone) {
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
    if (this.isNewOrClone() && result.productCreate) {
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
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  render() {
    const { productId, isSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (productId && !isNewOrClone) {
      mutationKey = { key: decodeId(productId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createProductMutation : updateProductMutation}
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
                          ProductFilesContainer,
                          FormContainer,
                        ]}
                      >
                        {(
                          productInfoState,
                          productProvidersState,
                          productTagsState,
                          productFilesState,
                          form
                        ) =>
                          (isNewOrClone ||
                            productInfoState.isDirty() ||
                            productProvidersState.isDirty() ||
                            productTagsState.isDirty() ||
                            productFilesState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...productInfoState.state,
                                      ...productProvidersState.state,
                                      ...productTagsState.state,
                                      ...productFilesState.state,
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
                                      ...productFilesState.state,
                                    },
                                    saveProduct,
                                    () => {
                                      productInfoState.onSuccess();
                                      productProvidersState.onSuccess();
                                      productTagsState.onSuccess();
                                      productFilesState.onSuccess();
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
                    <ProductForm product={{}} isNewOrClone />
                  ) : (
                    <QueryForm
                      query={productFormQuery}
                      entityId={productId}
                      entityType="product"
                      render={product => (
                        <Subscribe
                          to={[
                            ProductInfoContainer,
                            ProductProvidersContainer,
                            ProductTagsContainer,
                            ProductFilesContainer,
                          ]}
                        >
                          {(
                            productInfoState,
                            productProvidersState,
                            productTagsState,
                            productFilesState
                          ) => (
                            <ProductForm
                              isNewOrClone={isNewOrClone}
                              product={product}
                              onFormReady={() => {
                                const { tags, productProviders, files, ...info } = this.isClone()
                                  ? cleanUpCloneProductInput(product)
                                  : product;
                                productInfoState.initDetailValues(info);
                                productProvidersState.initDetailValues(productProviders);
                                productTagsState.initDetailValues(tags);
                                productFilesState.initDetailValues(files);
                              }}
                            />
                          )}
                        </Subscribe>
                      )}
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
