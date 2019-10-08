// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { showToastError } from 'utils/errors';
import { getByPath } from 'utils/fp';
import { decodeId } from 'utils/id';
import { SaveButton, ResetButton, ExportButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import { removeTypename } from 'utils/data';
import { containerFormQuery } from './form/query';
import { updateContainerMutation, prepareParsedContainerInput } from './form/mutation';
import { ContainerInfoContainer, ContainerBatchesContainer } from './form/containers';
import validator from './form/validator';
import ContainerForm from './form';
import { containerExportQuery } from './query';

type OptionalProps = {
  containerId: string,
  isSlideView: boolean,
};

type Props = OptionalProps & {
  intl: IntlShape,
};

const defaultProps = {
  containerId: '',
  isSlideView: false,
};

type UpdateContainerResponse = {|
  containerUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

const formContainer = new FormContainer();

class ContainerFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  onReset = (
    {
      containerInfoContainer,
      containerBatchesContainer,
    }: { containerInfoContainer: Object, containerBatchesContainer: Object },
    form: Object
  ) => {
    resetFormState(containerInfoContainer);
    resetFormState(containerBatchesContainer);
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    existingBatches: Array<Object>,
    newValues: Object,
    saveContainer: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { containerId } = this.props;

    const input = prepareParsedContainerInput({
      originalValues: removeTypename(originalValues),
      existingBatches: removeTypename(existingBatches),
      newValues: removeTypename(newValues),
      location: {
        inShipmentForm: false,
        inContainerForm: true,
      },
    });

    const result = await saveContainer({
      variables: { input, id: decodeId(containerId) },
    });

    if (result && result.data) {
      const { data } = result;
      if (data.containerUpdate) {
        const {
          containerUpdate: { violations },
        } = data;
        if (violations && violations.length) {
          onErrors(violations);
        } else {
          onSuccess(getByPath('containerUpdate', data));
        }
      }
    }
  };

  initAllValues = (
    {
      containerInfoContainer,
      containerBatchesContainer,
    }: { containerInfoContainer: Object, containerBatchesContainer: Object },
    container: Object
  ) => {
    const { batches = [], representativeBatch, ...info } = container;
    containerInfoContainer.initDetailValues(info);
    containerBatchesContainer.initDetailValues({ batches, representativeBatch });
    return null;
  };

  onFormReady = (
    {
      containerInfoContainer,
      containerBatchesContainer,
    }: { containerInfoContainer: Object, containerBatchesContainer: Object },
    container: Object
  ) => {
    const hasInitialStateYet =
      containerInfoContainer.state.id || Object.keys(container).length === 0;
    if (hasInitialStateYet) return null;

    this.initAllValues(
      {
        containerInfoContainer,
        containerBatchesContainer,
      },
      container
    );
    return null;
  };

  onMutationCompleted = (result: UpdateContainerResponse) => {
    const { intl } = this.props;
    showToastError({ result, intl, entity: 'container' });
  };

  render() {
    const { containerId, isSlideView } = this.props;
    const mutationKey = { key: decodeId(containerId) };
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    const CurrentLayout = isSlideView ? SlideViewLayout : React.Fragment;
    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={updateContainerMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveContainer, { loading, error }) => (
            <CurrentLayout>
              <CurrentNavBar>
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
                    link="container_shipmentSection"
                    label={
                      <FormattedMessage id="modules.container.shipment" defaultMessage="SHIPMENT" />
                    }
                    icon="SHIPMENT"
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
                <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
                  {(containerInfoContainer, containerBatchesContainer) => (
                    <>
                      {(containerInfoContainer.isDirty() ||
                        containerBatchesContainer.isDirty()) && (
                        <>
                          <ResetButton
                            onClick={() =>
                              this.onReset(
                                { containerInfoContainer, containerBatchesContainer },
                                formContainer
                              )
                            }
                          />
                          <SaveButton
                            id="container_form_save_button"
                            disabled={
                              !formContainer.isReady(
                                {
                                  ...containerInfoContainer.state,
                                  ...containerBatchesContainer.state,
                                },
                                validator
                              )
                            }
                            isLoading={loading}
                            onClick={() =>
                              this.onSave(
                                {
                                  ...containerInfoContainer.originalValues,
                                  ...containerBatchesContainer.originalValues,
                                },
                                containerBatchesContainer.existingBatches,
                                {
                                  ...containerInfoContainer.state,
                                  ...containerBatchesContainer.state,
                                },
                                saveContainer,
                                updateContainer => {
                                  this.initAllValues(
                                    { containerInfoContainer, containerBatchesContainer },
                                    updateContainer
                                  );
                                  formContainer.onReset();
                                },
                                formContainer.onErrors
                              )
                            }
                          />
                        </>
                      )}

                      {containerId &&
                        !containerInfoContainer.isDirty() &&
                        !containerBatchesContainer.isDirty() && (
                          <ExportButton
                            type="Container"
                            exportQuery={containerExportQuery}
                            variables={{ id: decodeId(containerId) }}
                          />
                        )}
                    </>
                  )}
                </Subscribe>
              </CurrentNavBar>
              <Content>
                {error && <p>Error: Please try again.</p>}
                <QueryForm
                  query={containerFormQuery}
                  entityId={containerId}
                  entityType="container"
                  render={container => {
                    return (
                      <>
                        <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
                          {(containerInfoContainer, containerBatchesContainer) =>
                            this.onFormReady(
                              { containerInfoContainer, containerBatchesContainer },
                              container
                            )
                          }
                        </Subscribe>
                        <ContainerForm container={container} />
                      </>
                    );
                  }}
                />
              </Content>
            </CurrentLayout>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(ContainerFormModule);
