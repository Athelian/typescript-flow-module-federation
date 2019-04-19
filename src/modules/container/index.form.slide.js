// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
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
import ContainerForm from './form';

type OptionalProps = {
  onSave: (newContainer: Object) => void,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  onSave: () => {},
};

const formContainer = new FormContainer();
export default class ContainerFormInSlide extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { container } = this.props;
    return !isEquals(container, nextProps.container);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { container, onSave } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[ContainerFormContainer]}>
          {containerContainer => (
            <Layout
              navBar={
                <NavBar>
                  <EntityIcon icon="CONTAINER" color="CONTAINER" />
                  <JumpToSection>
                    <SectionTabs
                      link="container_containerSection"
                      label={
                        <FormattedMessage
                          id="modules.container.container"
                          defaultMessage="CONTAINER"
                        />
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
                      label={
                        <FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" />
                      }
                      icon="ORDER"
                    />
                  </JumpToSection>
                  {containerContainer.isDirty() && (
                    <>
                      <ResetButton
                        onClick={() => {
                          resetFormState(containerContainer);
                          formContainer.onReset();
                        }}
                      />
                      <SaveButton
                        disabled={!formContainer.isReady(containerContainer.state, validator)}
                        onClick={() => onSave(containerContainer.state)}
                      />
                    </>
                  )}
                </NavBar>
              }
            >
              <ContainerForm
                inShipmentForm
                container={container}
                onFormReady={() => containerContainer.initDetailValues(container)}
              />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}
