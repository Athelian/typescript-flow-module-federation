// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { showToastError } from 'utils/errors';
import { getByPath } from 'utils/fp';
import { decodeId } from 'utils/id';
import { ExportButton } from 'components/Buttons';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { NavBar, EntityIcon, LogsButton } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import SlideView from 'components/SlideView';
import Timeline from 'modules/timeline/components/Timeline';
import { QueryForm } from 'components/common';
import { removeTypename } from 'utils/data';
import { UserConsumer } from 'contexts/Viewer';
import { containerFormQuery } from './form/query';
import { updateContainerMutation, prepareParsedContainerInput } from './form/mutation';
import { ContainerInfoContainer, ContainerBatchesContainer } from './form/containers';
import validator from './form/validator';
import ContainerForm from './form';
import { containerExportQuery, containerTimelineQuery } from './query';

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
    container: Object,
    timezone: string
  ) => {
    const { batches = [], representativeBatch, ...info } = container;
    containerInfoContainer.initDetailValues(info, timezone);
    containerBatchesContainer.initDetailValues({ batches, representativeBatch }, timezone);
    return null;
  };

  onFormReady = (
    {
      containerInfoContainer,
      containerBatchesContainer,
    }: { containerInfoContainer: Object, containerBatchesContainer: Object },
    container: Object,
    timezone: string
  ) => {
    const hasInitialStateYet =
      containerInfoContainer.state.id || Object.keys(container).length === 0;
    if (hasInitialStateYet) return null;

    this.initAllValues(
      {
        containerInfoContainer,
        containerBatchesContainer,
      },
      container,
      timezone
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
      <UserConsumer>
        {({ user }) => (
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
                          <FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" />
                        }
                        icon="ORDER"
                      />
                    </JumpToSection>
                    <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
                      {(containerInfoContainer, containerBatchesContainer) => (
                        <>
                          <BooleanValue>
                            {({ value: isOpen, set: toggleLogs }) => (
                              <>
                                <LogsButton
                                  entityType="container"
                                  entityId={containerId}
                                  onClick={() => toggleLogs(true)}
                                />
                                <SlideView isOpen={isOpen} onRequestClose={() => toggleLogs(false)}>
                                  <SlideViewLayout>
                                    {containerId && isOpen && (
                                      <>
                                        <SlideViewNavBar>
                                          <EntityIcon icon="LOGS" color="LOGS" />
                                        </SlideViewNavBar>

                                        <Content>
                                          <Timeline
                                            query={containerTimelineQuery}
                                            queryField="container"
                                            variables={{
                                              id: decodeId(containerId),
                                            }}
                                            entity={{
                                              containerId: decodeId(containerId),
                                            }}
                                            users={containerInfoContainer.state.shipment.followers}
                                          />
                                        </Content>
                                      </>
                                    )}
                                  </SlideViewLayout>
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>

                          {containerId &&
                            !containerInfoContainer.isDirty() &&
                            !containerBatchesContainer.isDirty() && (
                              <ExportButton
                                type="Container"
                                exportQuery={containerExportQuery}
                                variables={{ id: decodeId(containerId) }}
                              />
                            )}

                          {(containerInfoContainer.isDirty() ||
                            containerBatchesContainer.isDirty()) && (
                            <>
                              <ResetFormButton
                                onClick={() =>
                                  this.onReset(
                                    { containerInfoContainer, containerBatchesContainer },
                                    formContainer
                                  )
                                }
                              />
                              <SaveFormButton
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
                                        updateContainer,
                                        user.timezone
                                      );
                                      formContainer.onReset();
                                    },
                                    formContainer.onErrors
                                  )
                                }
                              />
                            </>
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
                                  container,
                                  user.timezone
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
        )}
      </UserConsumer>
    );
  }
}

export default injectIntl(ContainerFormModule);
