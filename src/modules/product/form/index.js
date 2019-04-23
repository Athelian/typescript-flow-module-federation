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

type OptionalProps = {
  isNewOrClone: boolean,
  isOwner: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  product: Object,
};

const defaultProps = {
  isNewOrClone: false,
  isOwner: true,
  onFormReady: () => {},
};

class ProductForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { product, isOwner } = this.props;

    return !isEquals(product, nextProps.product) || nextProps.isOwner !== isOwner;
  }

  componentDidUpdate() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { isNewOrClone, isOwner, product } = this.props;

    return (
      <div className={ProductFormWrapperStyle}>
        <SectionWrapper id="product_productSection">
          <Suspense fallback={<LoadingIcon />}>
            <AsyncProductSection isOwner={isOwner} isNew={isNewOrClone} product={product} />
          </Suspense>
        </SectionWrapper>

        <Suspense fallback={<LoadingIcon />}>
          <AsyncTaskSection type="product" />
        </Suspense>

        <SectionWrapper id="product_productProvidersSection">
          <Suspense fallback={<LoadingIcon />}>
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

            <AsyncProductProvidersSection isOwner={isOwner} />
          </Suspense>
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
      </div>
    );
  }
}

export default ProductForm;
