// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
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

const ProductProviderForm = ({ productProvider, isNew, isExist }: Props) => (
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
  </div>
);

ProductProviderForm.defaultProps = defaultProps;

export default ProductProviderForm;
