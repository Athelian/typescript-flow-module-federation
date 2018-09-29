// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import QueryDetail from 'components/common/QueryDetail';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
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
import query from './form/query';
import {
  createProductMutation,
  prepareCreateProductInput,
  updateProductMutation,
  prepareUpdateProductInput,
} from './form/mutation';

type Props = {
  productId?: string,
};

const defaultProps = {
  productId: '',
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

    const isNew = productId === 'new';
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
    const { productId } = this.props;
    const isNew = productId === 'new';

    if (isNew && result.productCreate) {
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

  render() {
    const { productId } = this.props;
    const isNew = productId === 'new';
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
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="PRODUCT" color="PRODUCT" />
                      <JumpToSection>
                        <SectionTabs link="productSection" label="PRODUCT" icon="PRODUCT" />
                        <SectionTabs
                          link="productProvidersSection"
                          label="PROVIDERS"
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
                              {isLoading && <LoadingIcon />}
                            </>
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !productId ? (
                    <ProductForm product={{}} isNew />
                  ) : (
                    <QueryDetail
                      query={query}
                      detailId={productId}
                      detailType="product"
                      render={product => (
                        <Subscribe
                          to={[
                            ProductInfoContainer,
                            ProductProvidersContainer,
                            ProductTagsContainer,
                          ]}
                        >
                          {(productInfoState, productProvidersState, productTagsState) => (
                            <ProductForm
                              product={product}
                              onDetailReady={() => {
                                const { tags, productProviders, ...info } = product;
                                productInfoState.initDetailValues(info);
                                productProvidersState.initDetailValues(productProviders);
                                productTagsState.initDetailValues(tags);
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
