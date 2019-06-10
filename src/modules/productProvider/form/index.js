// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { ProductProviderInfoContainer, ProductProviderTasksContainer } from './containers';
import { PackagingSection, ProductProviderSection, SpecificationsSection } from './components';
import { ProductProviderFormWrapperStyle } from './style';

const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));

type OptionalProps = {
  isNew: boolean,
  isExist: boolean,
  isOwner: boolean,
};

type Props = OptionalProps & {
  productProvider: Object,
  initDetailValues: Function,
};

const defaultProps = {
  isNew: false,
  isExist: false,
  isOwner: true,
};

class ProductProviderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { initDetailValues, productProvider } = this.props;

    initDetailValues(productProvider);
  }

  render() {
    const { productProvider, isNew, isOwner, isExist } = this.props;

    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={ProductProviderFormWrapperStyle}>
          <SectionWrapper id="productProvider_productProviderSection">
            <SectionHeader
              icon="PRODUCT_PROVIDER"
              title={
                <FormattedMessage
                  id="modules.ProductProviders.provider"
                  defaultMessage="END PRODUCT"
                />
              }
            >
              {productProvider.updatedAt && (
                <LastModified
                  updatedAt={productProvider.updatedAt}
                  updatedBy={productProvider.updatedBy}
                />
              )}
            </SectionHeader>
            <ProductProviderSection isExist={isExist} isNew={isNew} isOwner={isOwner} />
          </SectionWrapper>

          <SectionWrapper id="productProvider_specificationsSection">
            <SectionHeader
              icon="SPECIFICATIONS"
              title={
                <FormattedMessage
                  id="modules.ProductProviders.specifications"
                  defaultMessage="SPECIFICATIONS"
                />
              }
            />
            <SpecificationsSection isNew={isNew} isOwner={isOwner} />
          </SectionWrapper>

          <SectionWrapper id="productProvider_productProviderPackagingSection">
            <SectionHeader
              icon="PACKAGING"
              title={
                <FormattedMessage
                  id="modules.ProductProviders.packaging"
                  defaultMessage="PACKAGING"
                />
              }
            />
            <PackagingSection isNew={isNew} isOwner={isOwner} />
          </SectionWrapper>

          <SectionWrapper id="productProvider_documentsSection">
            <Subscribe to={[ProductProviderInfoContainer]}>
              {({ state: { files } }) => (
                <SectionHeader
                  icon="DOCUMENT"
                  title={
                    <>
                      <FormattedMessage
                        id="modules.productProvider.documents"
                        defaultMessage="DOCUMENTS"
                      />{' '}
                      ({files.length})
                    </>
                  }
                />
              )}
            </Subscribe>

            <AsyncDocumentsSection isOwner={isOwner} />
          </SectionWrapper>

          <AsyncTaskSection
            groupIds={[
              getByPath('product.importer.id', productProvider),
              getByPath('exporter.id', productProvider),
            ].filter(Boolean)}
            entityId={productProvider.id}
            type="productProvider"
          />

          <Subscribe to={[ProductProviderTasksContainer]}>
            {({
              state: {
                todo: { tasks },
              },
              setFieldValue,
            }) => (
              <AutoDateBinding
                type="productProvider"
                values={{}}
                tasks={tasks}
                setTaskValue={setFieldValue}
              />
            )}
          </Subscribe>
        </div>
      </Suspense>
    );
  }
}

export default ProductProviderForm;
