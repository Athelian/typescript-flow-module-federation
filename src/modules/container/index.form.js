// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { getByPath } from 'utils/fp';
import { decodeId } from 'utils/id';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import { SaveButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import { removeTypename } from 'utils/data';
import { containerFormQuery } from './form/query';
import { updateContainerMutation, prepareParsedContainerInput } from './form/mutation';
import { ContainerInfoContainer, ContainerBatchesContainer } from './form/containers';
import validator from './form/validator';
import ContainerForm from './form';

type OptionalProps = {
  containerId: string,
};

type Props = OptionalProps & {};

const defaultProps = {
  containerId: '',
};

type UpdateContainerResponse = {|
  containerUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

const formContainer = new FormContainer();
export default class ContainerFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  prevContainer = {};

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
    const hasInitialStateYet = getByPath('id', this.prevContainer) === getByPath('id', container);
    if (hasInitialStateYet) return null;

    this.prevContainer = { ...container };
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
    if (!result) {
      toast.error('There was an error. Please try again later');
    }
  };

  render() {
    const { containerId } = this.props;
    const mutationKey = { key: decodeId(containerId) };

    return (
      <UIConsumer>
        {uiState => (
          <Provider inject={[formContainer]}>
            <Mutation
              mutation={updateContainerMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveContainer, { loading, error }) => (
                <Layout
                  {...uiState}
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
                          link="container_shipmentSection"
                          label={
                            <FormattedMessage
                              id="modules.container.shipment"
                              defaultMessage="SHIPMENT"
                            />
                          }
                          icon="SHIPMENT"
                        />
                        <SectionTabs
                          link="container_batchesSection"
                          label={
                            <FormattedMessage
                              id="modules.container.batches"
                              defaultMessage="BATCHES"
                            />
                          }
                          icon="BATCH"
                        />
                        <SectionTabs
                          link="container_ordersSection"
                          label={
                            <FormattedMessage
                              id="modules.container.orders"
                              defaultMessage="ORDERS"
                            />
                          }
                          icon="ORDER"
                        />
                      </JumpToSection>
                      <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
                        {(containerInfoContainer, containerBatchesContainer) =>
                          (containerInfoContainer.isDirty() ||
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
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
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
                </Layout>
              )}
            </Mutation>
          </Provider>
        )}
      </UIConsumer>
    );
  }
}
