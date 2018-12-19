// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import ProductProviderContainer from './container';
import { PackagingSection, ProductProviderSection, SpecificationsSection } from './components';
import { ProductProviderFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  isExist: boolean,
};

type Props = OptionalProps & {
  productProvider: Object,
};

const defaultProps = {
  isNew: false,
  isExist: false,
};

const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));

const ProductProviderForm = ({ productProvider, isNew, isExist }: Props) => (
  <Suspense fallback={<LoadingIcon />}>
    <div className={ProductProviderFormWrapperStyle}>
      <SectionWrapper id="productProviderSection">
        <SectionHeader
          icon="PROVIDER"
          title={
            <FormattedMessage id="modules.ProductProviders.provider" defaultMessage="END PRODUCT" />
          }
        >
          {!isNew && (
            <LastModified
              updatedAt={productProvider.updatedAt}
              updatedBy={productProvider.updatedBy}
            />
          )}
        </SectionHeader>
        <ProductProviderSection isExist={isExist} isNew={isNew} />
      </SectionWrapper>

      <SectionWrapper id="specificationsSection">
        <SectionHeader
          icon="SPECIFICATIONS"
          title={
            <FormattedMessage
              id="modules.ProductProviders.specifications"
              defaultMessage="SPECIFICATIONS"
            />
          }
        />
        <SpecificationsSection isNew={isNew} />
      </SectionWrapper>

      <SectionWrapper id="productProviderPackagingSection">
        <SectionHeader
          icon="PACKAGING"
          title={
            <FormattedMessage id="modules.ProductProviders.packaging" defaultMessage="PACKAGING" />
          }
        />
        <PackagingSection isNew={isNew} />
      </SectionWrapper>
      <SectionWrapper id="documentsSection">
        <Subscribe to={[ProductProviderContainer]}>
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
        <AsyncDocumentsSection />
      </SectionWrapper>
    </div>
  </Suspense>
);

ProductProviderForm.defaultProps = defaultProps;

export default ProductProviderForm;
