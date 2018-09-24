// @flow
import * as React from 'react';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import ProductSection from './components/ProductSection';
import { ProductFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNew: false,
};

const ProductForm = ({ product, isNew }: Props) => (
  <div className={ProductFormWrapperStyle}>
    <SectionWrapper id="productSection">
      <SectionHeader icon="PRODUCT" title="PRODUCT">
        {!isNew && <LastModified updatedAt={product.updatedAt} updatedBy={product.updatedBy} />}
      </SectionHeader>
      <ProductSection isNew={isNew} />
    </SectionWrapper>
  </div>
);

ProductForm.defaultProps = defaultProps;

export default ProductForm;
