// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import ProductProviderContainer from 'modules/productProvider/form/container';
import validator from 'modules/productProvider/form/validator';
import ProductProviderForm from 'modules/productProvider/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

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
                  <JumpToSection>
                    <SectionTabs
                      link="productProviderSection"
                      label={
                        <FormattedMessage
                          id="modules.product.provider"
                          defaultMessage="END PRODUCT"
                        />
                      }
                      icon="PROVIDER"
                    />
                    <SectionTabs
                      link="specificationsSection"
                      label={
                        <FormattedMessage
                          id="modules.product.specifications"
                          defaultMessage="SPECIFICATIONS"
                        />
                      }
                      icon="SPECIFICATIONS"
                    />
                    <SectionTabs
                      link="productProviderPackagingSection"
                      label={
                        <FormattedMessage
                          id="modules.product.packaging"
                          defaultMessage="PACKAGING"
                        />
                      }
                      icon="PACKAGING"
                    />
                  </JumpToSection>
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={!isDirty() || !formContainer.isReady(state, validator)}
                    onClick={() => onSave(state)}
                  />
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
