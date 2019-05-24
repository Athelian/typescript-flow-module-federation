// @flow
import React, { lazy, Suspense } from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import { SectionWrapper, SectionHeader } from 'components/Form';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { isEquals, isDataType } from 'utils/fp';
import { FormContainer } from 'modules/form';
import { ProductTasksContainer } from './containers';
import { ProductFormWrapperStyle } from './style';

const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));
const AsyncProductSection = lazy(() => import('./components/ProductSection'));
const AsyncProductProvidersSection = lazy(() => import('./components/ProductProvidersSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));
const AsyncItemsSection = lazy(() => import('./components/ItemsSection'));

type OptionalProps = {
  isNewOrClone: boolean,
  isOwner: boolean,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNewOrClone: false,
  isOwner: true,
};

class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { product, isOwner } = this.props;

    return !isEquals(product, nextProps.product) || nextProps.isOwner !== isOwner;
  }

  render() {
    const { isNewOrClone, isOwner, product } = this.props;

    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={ProductFormWrapperStyle}>
          <SectionWrapper id="product_productSection">
            <AsyncProductSection isOwner={isOwner} isNew={isNewOrClone} product={product} />
          </SectionWrapper>

          <AsyncTaskSection entityId={product.id} type="product" />

          <SectionWrapper id="product_productProvidersSection">
            <SectionHeader
              icon="PRODUCT_PROVIDER"
              title={
                <FormattedMessage id="modules.Products.providers" defaultMessage="END PRODUCTS" />
              }
            />
            <Subscribe to={[FormContainer]}>
              {({ state: { touched, errors } }) => {
                // TODO: better UI for server side error message
                const errorMessage: ?string | ?Object = errors.productProviders;
                if (errorMessage && touched.productProviders) {
                  if (isDataType(Object, errorMessage)) {
                    const [topErrorMessage]: Array<any> = Object.values(errorMessage);
                    return <p>{topErrorMessage}</p>;
                  }
                  return <p>{errorMessage}</p>;
                }
                return '';
              }}
            </Subscribe>

            <AsyncProductProvidersSection isOwner={isOwner} productIsArchived={product.archived} />

            <Subscribe to={[ProductTasksContainer]}>
              {({
                state: {
                  todo: { tasks },
                },
                setFieldValue,
              }) => (
                <AutoDateBinding
                  type="product"
                  values={{}}
                  tasks={tasks}
                  setTaskValue={setFieldValue}
                />
              )}
            </Subscribe>
          </SectionWrapper>

          <AsyncOrdersSection id={product.id} />
          <AsyncItemsSection id={product.id} />
        </div>
      </Suspense>
    );
  }
}

export default ProductForm;
