// @flow
import * as React from 'react';
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
      <SectionHeader icon="PROVIDER" title="PROVIDER">
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
      <SectionHeader icon="SPECIFICATIONS" title="SPECIFICATIONS" />
      <SpecificationsSection isNew={isNew} />
    </SectionWrapper>

    <SectionWrapper id="productProviderPackagingSection">
      <SectionHeader icon="PACKAGING" title="PACKAGING" />
      <PackagingSection isNew={isNew} />
    </SectionWrapper>
  </div>
);

ProductProviderForm.defaultProps = defaultProps;

export default ProductProviderForm;
