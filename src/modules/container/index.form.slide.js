// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import Layout from 'components/Layout';
import { SaveButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import ContainerFormContainer from './form/container';
import validator from './form/validator';
import ContainerForm from './form/index';

type OptionalProps = {
  onFormReady: () => void,
  onSave: (newContainer: Object) => void,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  onFormReady: () => {},
  onSave: () => {},
};

export default class ContainerFormInSlide extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  onReset = (containerContainer: Object, form: Object) => {
    resetFormState(containerContainer);
    form.onReset();
  };

  render() {
    const { container, onSave } = this.props;

    return (
      <Provider>
        <Layout
          navBar={
            <NavBar>
              <EntityIcon icon="CONTAINER" color="CONTAINER" />
              <JumpToSection>
                <SectionTabs
                  link="container_containerSection"
                  label={
                    <FormattedMessage id="modules.container.container" defaultMessage="CONTAINER" />
                  }
                  icon="CONTAINER"
                />
                <SectionTabs
                  link="container_batchesSection"
                  label={
                    <FormattedMessage id="modules.container.batches" defaultMessage="BATCHES" />
                  }
                  icon="BATCH"
                />
                <SectionTabs
                  link="container_ordersSection"
                  label={<FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" />}
                  icon="ORDER"
                />
              </JumpToSection>
              <Subscribe to={[ContainerFormContainer, FormContainer]}>
                {(containerContainer, form) =>
                  containerContainer.isDirty() && (
                    <>
                      <ResetButton onClick={() => this.onReset(containerContainer, form)} />
                      <SaveButton
                        disabled={!form.isReady(containerContainer.state, validator)}
                        onClick={() => onSave(containerContainer.state)}
                      />
                    </>
                  )
                }
              </Subscribe>
            </NavBar>
          }
        >
          <Subscribe to={[ContainerFormContainer]}>
            {({ initDetailValues }) => (
              <ContainerForm
                inShipmentForm
                container={container}
                onFormReady={() => initDetailValues(container)}
              />
            )}
          </Subscribe>
        </Layout>
      </Provider>
    );
  }
}
