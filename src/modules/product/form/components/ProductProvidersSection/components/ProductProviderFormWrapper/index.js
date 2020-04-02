// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Provider, Subscribe } from 'unstated';
import {
  ProductProviderInfoContainer,
  ProductProviderTasksContainer,
  ProductProviderPackagesContainer,
} from 'modules/productProvider/form/containers';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import Timeline from 'modules/timeline/components/Timeline';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon, LogsButton } from 'components/NavBar';
import { CancelButton } from 'components/Buttons';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import SlideView from 'components/SlideView';
import { contains, getByPathWithDefault } from 'utils/fp';
import { productProviderTimelineQuery } from './query';

type OptionalProps = {
  isOwner: boolean,
  isNew: boolean,
};

type Props = OptionalProps & {
  productProviders: Array<Object>,
  productProvider: Object,
  product?: Object,
  onSave: Function,
  onCancel: Function,
};

const defaultProps = {
  isOwner: true,
  isNew: false,
};

const formContainer = new FormContainer();

const exist = (productProvider: Object, productProviders: Array<Object>): boolean => {
  const provider = {
    name: getByPathWithDefault(0, 'name', productProvider),
    exporter: getByPathWithDefault(0, 'exporter.id', productProvider),
    supplier: getByPathWithDefault(0, 'supplier.id', productProvider),
  };
  const providers = productProviders
    .filter(item => item.id !== productProvider.id)
    .map(item => ({
      name: getByPathWithDefault(0, 'name', item),
      exporter: getByPathWithDefault(0, 'exporter.id', item),
      supplier: getByPathWithDefault(0, 'supplier.id', item),
    }));

  return contains(provider, providers);
};

const ProductProviderFormWrapper = ({
  isOwner,
  isNew,
  onSave,
  product,
  productProviders,
  productProvider,
  onCancel,
}: Props) => {
  useEffect(() => {
    return () => formContainer.onReset();
  });
  return (
    <Provider inject={[formContainer]}>
      <Subscribe
        to={[
          ProductProviderInfoContainer,
          ProductProviderTasksContainer,
          ProductProviderPackagesContainer,
        ]}
      >
        {(
          productProviderInfoContainer,
          productProviderTasksContainer,
          productProviderPackagesContainer
        ) => {
          const isExist = exist(productProviderInfoContainer.state, productProviders);
          const disableSaveButton =
            !formContainer.isReady(
              {
                ...productProviderInfoContainer.state,
                ...productProviderTasksContainer.state,
                ...productProviderPackagesContainer.state,
              },
              validator
            ) || isExist;

          return (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" />
                <JumpToSection>
                  <SectionTabs
                    link="productProvider_productProviderSection"
                    label={
                      <FormattedMessage
                        id="modules.Products.provider"
                        defaultMessage="END PRODUCT"
                      />
                    }
                    icon="PRODUCT_PROVIDER"
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
                    link="productProvider_packagingSection"
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
                  <SectionTabs
                    link="productProvider_taskSection"
                    label={<FormattedMessage id="modules.Products.tasks" defaultMessage="TASKS" />}
                    icon="TASK"
                  />
                </JumpToSection>
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) =>
                    !isNew &&
                    productProvider.id &&
                    !productProvider.hideLogs && (
                      <>
                        <LogsButton
                          entityType="productProvider"
                          entityId={productProvider.id}
                          onClick={() => slideToggle(true)}
                        />
                        <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                          <SlideViewLayout>
                            {opened && (
                              <>
                                <SlideViewNavBar>
                                  <EntityIcon icon="LOGS" color="LOGS" />
                                </SlideViewNavBar>

                                <Content>
                                  <Timeline
                                    query={productProviderTimelineQuery}
                                    queryField="productProvider"
                                    variables={{
                                      id: productProvider.id,
                                    }}
                                    entity={{
                                      productProviderId: productProvider.id,
                                    }}
                                    users={[...(product?.followers || [])]}
                                  />
                                </Content>
                              </>
                            )}
                          </SlideViewLayout>
                        </SlideView>
                      </>
                    )
                  }
                </BooleanValue>
                {isNew && (
                  <>
                    <CancelButton onClick={() => onCancel()} />
                    <SaveFormButton
                      id="end_product_form_save_button"
                      data-testid="saveProviderButton"
                      disabled={disableSaveButton}
                      onClick={() =>
                        onSave({
                          ...productProviderInfoContainer.state,
                          ...productProviderTasksContainer.state,
                          ...productProviderPackagesContainer.state,
                        })
                      }
                    />
                  </>
                )}
                {!isNew &&
                  (productProviderInfoContainer.isDirty() ||
                    productProviderPackagesContainer.isDirty() ||
                    productProviderTasksContainer.isDirty()) && (
                    <>
                      <ResetFormButton
                        onClick={() => {
                          resetFormState(productProviderInfoContainer);
                          resetFormState(productProviderPackagesContainer);
                          resetFormState(productProviderTasksContainer, 'todo');
                          formContainer.onReset();
                        }}
                      />
                      <SaveFormButton
                        id="end_product_form_save_button"
                        data-testid="saveProviderButton"
                        disabled={disableSaveButton}
                        onClick={() =>
                          onSave({
                            ...productProviderInfoContainer.state,
                            ...productProviderTasksContainer.state,
                            ...productProviderPackagesContainer.state,
                          })
                        }
                      />
                    </>
                  )}
              </SlideViewNavBar>

              <Content>
                <ProductProviderForm
                  productProvider={productProvider}
                  initDetailValues={(values: Object) => {
                    const { todo, packages, defaultPackage, ...info } = values;
                    productProviderInfoContainer.initDetailValues(info);
                    productProviderTasksContainer.initDetailValues(todo);
                    productProviderPackagesContainer.initDetailValues({ packages, defaultPackage });
                  }}
                  isExist={isExist}
                  isNew={isNew}
                  isOwner={isOwner}
                />
              </Content>
            </SlideViewLayout>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

ProductProviderFormWrapper.defaultProps = defaultProps;

export default ProductProviderFormWrapper;
