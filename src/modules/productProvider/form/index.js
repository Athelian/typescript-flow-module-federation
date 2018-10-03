// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import { PackagingSection, ProductProviderSection, SpecificationsSection } from './components';
import { ProductProviderFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
};

type Props = OptionalProps & {
  productProvider: Object,
};

const defaultProps = {
  isNew: false,
};

const ProductProviderForm = ({ productProvider, isNew }: Props) => (
  <div className={ProductProviderFormWrapperStyle}>
    <SectionWrapper id="productProviderSection">
      <SectionHeader
        icon="PROVIDER"
        title={<FormattedMessage id="modules.productProvider.provider" defaultMessage="PROVIDER" />}
      >
        {!isNew && (
          <LastModified
            updatedAt={productProvider.updatedAt}
            updatedBy={productProvider.updatedBy}
          />
        )}
      </SectionHeader>
      <ProductProviderSection isNew={isNew} />
    </SectionWrapper>

    <SectionWrapper id="specificationsSection">
      <SectionHeader
        icon="SPECIFICATIONS"
        title={
          <FormattedMessage
            id="modules.productProvider.specifications"
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
          <FormattedMessage id="modules.productProvider.packaging" defaultMessage="PACKAGING" />
        }
      />
      <PackagingSection isNew={isNew} />
    </SectionWrapper>
  </div>
);

ProductProviderForm.defaultProps = defaultProps;

export default ProductProviderForm;
