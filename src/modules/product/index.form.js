// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { QueryForm } from 'components/common';
import { getByPath } from 'utils/fp';
import { UIConsumer } from 'modules/ui';
import { showToastError } from 'utils/errors';
import { UserConsumer } from 'modules/user';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import NavBar, { EntityIcon, LogsButton, SlideViewNavBar } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import Timeline from 'modules/timeline/components/Timeline';
import { encodeId, decodeId, uuid } from 'utils/id';
import { removeTypename } from 'utils/data';
import {
  ProductInfoContainer,
  ProductProvidersContainer,
  ProductTagsContainer,
  ProductFilesContainer,
  ProductTasksContainer,
} from './form/containers';
import ProductForm from './form';
import validator from './form/validator';
import { productFormQuery } from './form/query';
import {
  createProductMutation,
  updateProductMutation,
  prepareParsedProductInput,
} from './form/mutation';
import { productTimelineQuery, productExportQuery } from './query';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
};
type Props = OptionalProps & {
  intl: IntlShape,
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
  productTasksState: Object,
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
    productTasksState,
    form,
  }: ProductFormState & { form: Object }) => {
    resetFormState(productInfoState);
    resetFormState(productTagsState, 'tags');
    resetFormState(productFilesState, 'files');
    resetFormState(productTasksState, 'todo');
    resetFormState(productProvidersState, 'productProviders');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveProduct: any => Promise<?{ data?: CreateProductResponse | UpdateProductResponse }>,
    onSuccess: Object => void,
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
            onSuccess(getByPath('productCreate', data));
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
            onSuccess(getByPath('productUpdate', data));
          }
        }
      }
    }
  };

  initAllValues = (
    {
      productInfoState,
      productTagsState,
      productFilesState,
      productTasksState,
      productProvidersState,
    }: ProductFormState,
    product: Object
  ) => {
    const { tags = [], productProviders = [], files = [], todo = { tasks: [] }, ...info } = product;
    productInfoState.initDetailValues(info);
    productTagsState.initDetailValues(tags);
    productTasksState.initDetailValues(todo);
    productFilesState.initDetailValues(files);
    productProvidersState.initDetailValues(productProviders);
  };

  initAllValuesForClone = (
    {
      productInfoState,
      productTagsState,
      productFilesState,
      productTasksState,
      productProvidersState,
    }: ProductFormState,
    product: Object
  ) => {
    const { tags = [], productProviders, files, todo, ...info } = product;
    productInfoState.initDetailValues(info);
    productTagsState.initDetailValues(tags);
    productTasksState.initDetailValues({ tasks: [] });
    productFilesState.initDetailValues([]);
    productProvidersState.initDetailValues(
      product.productProviders.map(({ updatedBy, archived, ...productProvider }) => ({
        ...productProvider,
        isNew: true,
        files: [],
      }))
    );
  };

  onFormReady = (
    {
      productInfoState,
      productTagsState,
      productFilesState,
      productTasksState,
      productProvidersState,
    }: ProductFormState,
    product: Object
  ) => {
    const hasInitialStateYet = productInfoState.state.id || Object.keys(product).length === 0;
    if (hasInitialStateYet) return null;

    const { tags, productProviders, files, todo, ...info } = product;
    productInfoState.initDetailValues(info);
    productTagsState.initDetailValues(tags);

    if (this.isClone()) {
      this.initAllValuesForClone(
        {
          productInfoState,
          productTagsState,
          productFilesState,
          productTasksState,
          productProvidersState,
        },
        product
      );
    } else {
      this.initAllValues(
        {
          productInfoState,
          productTagsState,
          productFilesState,
          productTasksState,
          productProvidersState,
        },
        product
      );
    }

    return null;
  };

  onMutationCompleted = (result: CreateProductResponse | UpdateProductResponse) => {
    const { intl } = this.props;

    if (showToastError({ result, intl, entity: 'product' })) {
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
                        link="product_taskSection"
                        label={
                          <FormattedMessage id="modules.Products.task" defaultMessage="TASKS" />
                        }
                        icon="TASK"
                      />
                      <SectionTabs
                        link="product_productProvidersSection"
                        label={
                          <FormattedMessage
                            id="modules.Products.providers"
                            defaultMessage="END PRODUCTS"
                          />
                        }
                        icon="PRODUCT_PROVIDER"
                      />

                      <SectionTabs
                        link="product_relatedSection"
                        label={
                          <FormattedMessage
                            id="modules.Products.related"
                            defaultMessage="RELATED"
                          />
                        }
                        icon="RELATED"
                      />
                    </JumpToSection>
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) =>
                        !isNewOrClone && (
                          <>
                            <LogsButton onClick={() => slideToggle(true)} />
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
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

                    <Subscribe
                      to={[
                        ProductInfoContainer,
                        ProductProvidersContainer,
                        ProductTagsContainer,
                        ProductFilesContainer,
                        ProductTasksContainer,
                        FormContainer,
                      ]}
                    >
                      {(
                        productInfoState,
                        productProvidersState,
                        productTagsState,
                        productFilesState,
                        productTasksState,
                        form
                      ) => (
                        <>
                          {(isNewOrClone ||
                            productInfoState.isDirty() ||
                            productProvidersState.isDirty() ||
                            productTagsState.isDirty() ||
                            productTasksState.isDirty() ||
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
                                      productTasksState,
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
                                      ...productTasksState.state,
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
                                      ...productTasksState.originalValues,
                                    },
                                    {
                                      ...productInfoState.state,
                                      ...productProvidersState.state,
                                      ...productTagsState.state,
                                      ...productFilesState.state,
                                      ...productTasksState.state,
                                    },
                                    saveProduct,
                                    updateProduct => {
                                      this.initAllValues(
                                        {
                                          productInfoState,
                                          productTagsState,
                                          productFilesState,
                                          productTasksState,
                                          productProvidersState,
                                        },
                                        updateProduct
                                      );
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
                            </>
                          )}

                          {productId &&
                            !productInfoState.isDirty() &&
                            !productProvidersState.isDirty() &&
                            !productTagsState.isDirty() &&
                            !productTasksState.isDirty() &&
                            !productFilesState.isDirty() &&
                            !isNewOrClone && (
                              <ExportButton
                                type="Product"
                                exportQuery={productExportQuery}
                                variables={{ id: decodeId(productId) }}
                              />
                            )}
                        </>
                      )}
                    </Subscribe>
                  </NavBar>
                }
              >
                {apiError && <p>Error: Please try again.</p>}
                {!productId ? (
                  <UserConsumer>
                    {({ user }) => {
                      const { group } = user;
                      const { types = [] } = group;
                      const isImporter = types.includes('Importer');
                      return (
                        <>
                          <ProductForm product={{}} isNewOrClone />
                          <Subscribe
                            to={[
                              ProductInfoContainer,
                              ProductProvidersContainer,
                              ProductTagsContainer,
                              ProductFilesContainer,
                              ProductTasksContainer,
                            ]}
                          >
                            {(
                              productInfoState,
                              productProvidersState,
                              productTagsState,
                              productFilesState,
                              productTasksState
                            ) =>
                              this.onFormReady(
                                {
                                  productInfoState,
                                  productProvidersState,
                                  productTagsState,
                                  productFilesState,
                                  productTasksState,
                                },
                                {
                                  id: uuid(),
                                  importer: isImporter ? group : {},
                                  tags: [],
                                  todo: {
                                    tasks: [],
                                  },
                                  files: [],
                                }
                              )
                            }
                          </Subscribe>
                        </>
                      );
                    }}
                  </UserConsumer>
                ) : (
                  <QueryForm
                    query={productFormQuery}
                    entityId={productId}
                    entityType="product"
                    render={(product, isOwner) => (
                      <>
                        <ProductForm
                          isOwner={isOwner}
                          isNewOrClone={isNewOrClone}
                          product={product}
                        />
                        <Subscribe
                          to={[
                            ProductInfoContainer,
                            ProductProvidersContainer,
                            ProductTagsContainer,
                            ProductFilesContainer,
                            ProductTasksContainer,
                          ]}
                        >
                          {(
                            productInfoState,
                            productProvidersState,
                            productTagsState,
                            productFilesState,
                            productTasksState
                          ) =>
                            this.onFormReady(
                              {
                                productInfoState,
                                productProvidersState,
                                productTagsState,
                                productFilesState,
                                productTasksState,
                              },
                              product
                            )
                          }
                        </Subscribe>
                      </>
                    )}
                  />
                )}
              </Layout>
            )}
          </Mutation>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ProductFormModule);
