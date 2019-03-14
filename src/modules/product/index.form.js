// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import NavBar, { EntityIcon, LogsButton, SlideViewNavBar } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import Timeline from 'modules/timeline/components/Timeline';
import { encodeId, decodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import {
  ProductInfoContainer,
  ProductProvidersContainer,
  ProductTagsContainer,
  ProductFilesContainer,
} from './form/containers';
import validator from './form/validator';
import { productFormQuery } from './form/query';
import {
  createProductMutation,
  updateProductMutation,
  prepareParsedProductInput,
} from './form/mutation';
import ProductForm from './form';
import { productTimelineQuery } from './query';

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

type ProductFormState = {
  productInfoState: Object,
  productProvidersState: Object,
  productTagsState: Object,
  productFilesState: Object,
};

class ProductFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

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
    originalValues: Object,
    formData: Object,
    saveProduct: any => Promise<?{ data?: CreateProductResponse | UpdateProductResponse }>,
    onSuccess: () => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { productId } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedProductInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData)
    );

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

  onFormReady = ({
    productInfoState,
    productTagsState,
    productFilesState,
    productProvidersState,
  }: {
    productInfoState: Object,
    productTagsState: Object,
    productFilesState: Object,
    productProvidersState: Object,
  }) => (product: Object) => {
    const { tags, productProviders, files, ...info } = product;

    if (this.isClone()) {
      productFilesState.initDetailValues([]);
      productProvidersState.initDetailValues(
        product.productProviders.map(({ updatedBy, archived, ...productProvider }) => ({
          ...productProvider,
          isNew: true,
          files: [],
        }))
      );
    } else {
      productFilesState.initDetailValues(files);
      productProvidersState.initDetailValues(productProviders);
    }
    productInfoState.initDetailValues(info);
    productTagsState.initDetailValues(tags);
  };

  onMutationCompleted = (result: CreateProductResponse | UpdateProductResponse) => {
    if (!result) {
      toast.error('There was an error. Please try again later');
      return;
    }

    if (this.isNewOrClone() && result.productCreate) {
      const { productCreate } = result;

      if (!productCreate.violations) {
        if (productCreate.id) {
          navigate(`/product/${encodeId(productCreate.id)}`);
        }
      }
    }
  };

  render() {
    const { productId, isSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (productId && !isNewOrClone) {
      mutationKey = { key: decodeId(productId) };
    }

    return (
      <UIConsumer>
        {uiState => (
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
            ) => (
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

                        <BooleanValue>
                          {({ value: opened, set: slideToggle }) =>
                            !isNewOrClone && (
                              <>
                                <LogsButton onClick={() => slideToggle(true)} />
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                  options={{ width: '1030px' }}
                                >
                                  <Layout
                                    navBar={
                                      <SlideViewNavBar>
                                        <EntityIcon icon="LOGS" color="LOGS" />
                                      </SlideViewNavBar>
                                    }
                                  >
                                    {productId && opened ? (
                                      <Timeline
                                        query={productTimelineQuery}
                                        queryField="product"
                                        variables={{
                                          id: decodeId(productId),
                                        }}
                                        entity={{
                                          productId: decodeId(productId),
                                        }}
                                      />
                                    ) : null}
                                  </Layout>
                                </SlideView>
                              </>
                            )
                          }
                        </BooleanValue>

                        {(isNewOrClone ||
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
                                    ...productInfoState.originalValues,
                                    ...productProvidersState.originalValues,
                                    ...productTagsState.originalValues,
                                    ...productFilesState.originalValues,
                                  },
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
                        )}
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
                        render={(product, isOwner) => (
                          <ProductForm
                            isOwner={isOwner}
                            isNewOrClone={isNewOrClone}
                            product={product}
                            onFormReady={() => {
                              this.onFormReady({
                                productInfoState,
                                productTagsState,
                                productFilesState,
                                productProvidersState,
                              })(product);
                            }}
                          />
                        )}
                      />
                    )}
                  </Layout>
                )}
              </Mutation>
            )}
          </Subscribe>
        )}
      </UIConsumer>
    );
  }
}

export default ProductFormModule;
