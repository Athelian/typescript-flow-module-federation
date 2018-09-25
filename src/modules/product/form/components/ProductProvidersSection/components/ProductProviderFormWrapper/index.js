// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';

type Props = {
  productProvider: Object,
  isNew: boolean,
  initDetailValues: Function,
  onSave: Function,
  onCancel: Function,
};

const formContainer = new FormContainer();

class ProductProviderFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { productProvider, initDetailValues } = this.props;
    initDetailValues(productProvider);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { isNew, onSave, onCancel } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[ProductProviderContainer]}>
          {({ state, isDirty }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PROVIDER" color="PROVIDER" />
                  <CancelButton disabled={false} onClick={onCancel}>
                    Cancel
                  </CancelButton>
                  <SaveButton
                    disabled={!isDirty() || !formContainer.isReady(state, validator)}
                    onClick={() => onSave(state)}
                  >
                    Save
                  </SaveButton>
                </SlideViewNavBar>
              }
            >
              <ProductProviderForm productProvider={state} isNew={isNew} />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default ProductProviderFormWrapper;
