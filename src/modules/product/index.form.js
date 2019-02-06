// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
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
    violations?: Array<Object>,
    id?: string,
  },
|};

type UpdateProductResponse = {|
  productUpdate: {
    violations?: Array<Object>,
    id?: string,
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

type ProductFormState = {
  productInfoState: Object,
  productProvidersState: Object,
  productTagsState: Object,
  productFilesState: Object,
};

class ProductFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onCancel = () => navigate(`/product`);

  onReset = ({
    productInfoState,
    productTagsState,
    productFilesState,
    productProvidersState,
    form,
  }: ProductFormState & { form: Object }) => {
    resetFormState(productInfoState);
    resetFormState(productTagsState, 'tags');
    resetFormState(productFilesState, 'files');
    resetFormState(productProvidersState, 'productProviders');
    form.onReset();
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
      const { productCreate } = result;

      if (!productCreate.violations) {
        if (productCreate.id) {
          navigate(`/product/${encodeId(productCreate.id)}`);
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
                          link="product_productSection"
                          label={
                            <FormattedMessage
                              id="modules.Products.product"
                              defaultMessage="PRODUCT"
                            />
                          }
                          icon="PRODUCT"
                        />
                        <SectionTabs
                          link="product_productProvidersSection"
                          label={
                            <FormattedMessage
                              id="modules.Products.providers"
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
                              {this.isNewOrClone() ? (
                                <CancelButton onClick={() => this.onCancel()} />
                              ) : (
                                <ResetButton
                                  onClick={() => {
                                    this.onReset({
                                      productInfoState,
                                      productProvidersState,
                                      productTagsState,
                                      productFilesState,
                                      form,
                                    });
                                  }}
                                />
                              )}

                              <SaveButton
                                data-testid="saveButton"
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
