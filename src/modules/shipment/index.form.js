// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import QueryFormV2 from 'components/common/QueryFormV2';
import { navigate } from '@reach/router';
import { UserConsumer } from 'modules/user';
import { getByPath } from 'utils/fp';
import { showToastError } from 'utils/errors';
import { Content, SlideViewLayout } from 'components/Layout';
import { removeTypename } from 'utils/data';
import { FormContainer } from 'modules/form';
import { initValues as taskInitValues } from 'modules/shipment/form/containers/tasks';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import { NavBar, EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId, decodeId, uuid } from 'utils/id';
import Timeline from 'modules/timeline/components/Timeline';
import { shipmentExportQuery, shipmentTimelineQuery } from './query';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
  ShipmentFilesContainer,
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentTasksContainer,
} from './form/containers';
import ShipmentForm from './form';
import validator from './form/validator';
import { shipmentFormQuery } from './form/query';
import {
  createShipmentMutation,
  updateShipmentMutation,
  prepareParsedShipmentInput,
} from './form/mutation';

type OptionalProps = {
  path: string,
  shipmentId: string,
  anchor: string,
  isSlideView: boolean,
  onSuccessCallback: ?Function,
  redirectAfterSuccess: boolean,
  onCancel?: Function,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  shipmentId: '',
  anchor: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
  initDataForSlideView: {},
};

type CreateShipmentResponse = {|
  shipmentCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type UpdateShipmentResponse = {|
  shipmentUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type ShipmentFormState = {
  shipmentInfoContainer: Object,
  shipmentTagsContainer: Object,
  shipmentTransportTypeContainer: Object,
  shipmentTimelineContainer: Object,
  shipmentBatchesContainer: Object,
  shipmentContainersContainer: Object,
  shipmentFilesContainer: Object,
  shipmentTasksContainer: Object,
};

const formContainer = new FormContainer();
class ShipmentFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate(`/shipment`);

  onSave = async (
    originalValues: Object,
    existingBatches: Array<Object>,
    newValues: Object,
    saveShipment: Function,
    onSuccess: Object => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { shipmentId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();

    const input = prepareParsedShipmentInput({
      originalValues: isNewOrClone ? null : removeTypename(originalValues),
      existingBatches: removeTypename(existingBatches),
      newValues: removeTypename(newValues),
    });

    if (isNewOrClone) {
      const result = await saveShipment({
        variables: { input },
      });
      if (result && result.data) {
        const { data } = result;
        if (data.shipmentCreate) {
          const {
            shipmentCreate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess(getByPath('shipmentCreate', data));
            if (onSuccessCallback) {
              onSuccessCallback(data);
            }
          }
        }
      }
    } else if (shipmentId) {
      const result = await saveShipment({
        variables: { input, id: decodeId(shipmentId) },
      });
      if (result && result.data) {
        const { data } = result;
        if (data.shipmentUpdate) {
          const {
            shipmentUpdate: { violations },
          } = data;
          if (violations && violations.length) {
            onErrors(violations);
          } else {
            onSuccess(getByPath('shipmentUpdate', data));
          }
        }
      }
    }
  };

  initAllValues = (
    {
      shipmentInfoContainer,
      shipmentTagsContainer,
      shipmentTransportTypeContainer,
      shipmentTimelineContainer,
      shipmentBatchesContainer,
      shipmentContainersContainer,
      shipmentFilesContainer,
      shipmentTasksContainer,
    }: ShipmentFormState,
    shipment: Object
  ) => {
    const {
      batches = [],
      containers = [],
      tags = [],
      transportType = null,
      cargoReady = {},
      voyages = [{}],
      containerGroups = [{}],
      files = [],
      hasCalledTasksApiYet = false,
      hasCalledBatchesApiYet = false,
      hasCalledTimelineApiYet = false,
      hasCalledContainerApiYet = false,
      todo = taskInitValues.todo,
      ...info
    }: Object = shipment;
    shipmentInfoContainer.initDetailValues(info);
    shipmentBatchesContainer.initDetailValues(
      batches,
      hasCalledBatchesApiYet || batches.length > 0
    );
    shipmentContainersContainer.initDetailValues(
      containers,
      hasCalledContainerApiYet || containers.length > 0
    );
    shipmentTimelineContainer.initDetailValues(
      {
        cargoReady,
        voyages,
        containerGroups,
      },
      hasCalledTimelineApiYet
    );
    shipmentFilesContainer.initDetailValues(files);
    shipmentTasksContainer.initDetailValues(todo, hasCalledTasksApiYet || todo.tasks.length > 0);
    shipmentTagsContainer.initDetailValues(tags);
    shipmentTransportTypeContainer.initDetailValues(transportType);
    return null;
  };

  initAllValuesForClone = (
    {
      shipmentInfoContainer,
      shipmentTagsContainer,
      shipmentTransportTypeContainer,
      shipmentTimelineContainer,
      shipmentBatchesContainer,
      shipmentContainersContainer,
      shipmentFilesContainer,
      shipmentTasksContainer,
    }: ShipmentFormState,
    shipment: Object
  ) => {
    const {
      bookingDate,
      blDate,
      no,
      batches,
      containers,
      tags,
      transportType,
      cargoReady,
      voyages,
      containerGroups,
      files,
      todo,
      hasCalledTasksApiYet = false,
      hasCalledBatchesApiYet = false,
      hasCalledTimelineApiYet = false,
      hasCalledContainerApiYet = false,
      ...info
    }: Object = shipment;
    shipmentInfoContainer.initDetailValues({
      ...info,
      no: `[cloned] ${no}`,
    });
    shipmentBatchesContainer.initDetailValues([], hasCalledBatchesApiYet);
    shipmentContainersContainer.initDetailValues([], hasCalledContainerApiYet);
    shipmentTimelineContainer.initDetailValues({}, hasCalledTimelineApiYet);
    shipmentFilesContainer.initDetailValues([]);
    shipmentTasksContainer.initDetailValues({ tasks: [] }, hasCalledTasksApiYet);
    shipmentTagsContainer.initDetailValues(tags);
    shipmentTransportTypeContainer.initDetailValues(transportType);
    return null;
  };

  onFormReady = (
    {
      shipmentInfoContainer,
      shipmentTagsContainer,
      shipmentTransportTypeContainer,
      shipmentTimelineContainer,
      shipmentBatchesContainer,
      shipmentContainersContainer,
      shipmentFilesContainer,
      shipmentTasksContainer,
    }: ShipmentFormState,
    shipment: Object
  ) => {
    const hasInitialStateYet = shipmentInfoContainer.state.id || Object.keys(shipment).length === 0;
    if (hasInitialStateYet) return null;

    if (this.isClone()) {
      this.initAllValuesForClone(
        {
          shipmentInfoContainer,
          shipmentTagsContainer,
          shipmentTransportTypeContainer,
          shipmentTimelineContainer,
          shipmentBatchesContainer,
          shipmentContainersContainer,
          shipmentFilesContainer,
          shipmentTasksContainer,
        },
        shipment
      );
    } else {
      this.initAllValues(
        {
          shipmentInfoContainer,
          shipmentTagsContainer,
          shipmentTransportTypeContainer,
          shipmentTimelineContainer,
          shipmentBatchesContainer,
          shipmentContainersContainer,
          shipmentFilesContainer,
          shipmentTasksContainer,
        },
        shipment
      );
    }
    return null;
  };

  onMutationCompleted = (result: CreateShipmentResponse | UpdateShipmentResponse) => {
    const { redirectAfterSuccess, intl } = this.props;

    if (showToastError({ result, intl, entity: 'shipment' })) {
      return;
    }

    if (result.shipmentCreate) {
      const { shipmentCreate } = result;

      if (!shipmentCreate.violations) {
        if (shipmentCreate.id && redirectAfterSuccess) {
          navigate(`/shipment/${encodeId(shipmentCreate.id)}`);
        }
      }
    }
  };

  render() {
    const { shipmentId, anchor, isSlideView, onCancel, initDataForSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (shipmentId && !isNewOrClone) {
      mutationKey = { key: decodeId(shipmentId) };
    }
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    const CurrentLayout = isSlideView ? SlideViewLayout : React.Fragment;

    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={isNewOrClone ? createShipmentMutation : updateShipmentMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveShipment, { loading: isLoading, error: apiError }) => {
            return (
              <CurrentLayout>
                <CurrentNavBar>
                  <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                  <JumpToSection>
                    <SectionTabs
                      link="shipment_shipmentSection"
                      label={
                        <FormattedMessage
                          id="modules.Shipments.shipment"
                          defaultMessage="SHIPMENT"
                        />
                      }
                      icon="SHIPMENT"
                    />
                    <SectionTabs
                      link="shipment_timelineSection"
                      label={
                        <FormattedMessage
                          id="modules.Shipments.timeline"
                          defaultMessage="TIMELINE"
                        />
                      }
                      icon="TIMELINE"
                    />
                    <SectionTabs
                      link="shipment_cargoSection"
                      label={
                        <FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO" />
                      }
                      icon="CARGO"
                    />
                    <SectionTabs
                      link="shipment_documentsSection"
                      label={
                        <FormattedMessage
                          id="modules.Shipments.document"
                          defaultMessage="DOCUMENTS"
                        />
                      }
                      icon="DOCUMENT"
                    />
                    <SectionTabs
                      link="shipment_taskSection"
                      label={
                        <FormattedMessage id="modules.Shipments.task" defaultMessage="TASKS" />
                      }
                      icon="TASK"
                    />
                    <SectionTabs
                      link="shipment_orderSection"
                      label={
                        <FormattedMessage id="modules.Shipments.order" defaultMessage="ORDERS" />
                      }
                      icon="ORDER"
                    />
                  </JumpToSection>
                  <BooleanValue>
                    {({ value: opened, set: slideToggle }) =>
                      !isNewOrClone && (
                        <>
                          <LogsButton onClick={() => slideToggle(true)} />
                          <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                            <SlideViewLayout
                              navBar={
                                <SlideViewNavBar>
                                  <EntityIcon icon="LOGS" color="LOGS" />
                                </SlideViewNavBar>
                              }
                            >
                              {shipmentId && opened ? (
                                <Timeline
                                  query={shipmentTimelineQuery}
                                  queryField="shipment"
                                  variables={{
                                    id: decodeId(shipmentId),
                                  }}
                                  entity={{
                                    shipmentId: decodeId(shipmentId),
                                  }}
                                />
                              ) : null}
                            </SlideViewLayout>
                          </SlideView>
                        </>
                      )
                    }
                  </BooleanValue>
                  <Subscribe
                    to={[
                      ShipmentInfoContainer,
                      ShipmentTagsContainer,
                      ShipmentTransportTypeContainer,
                      ShipmentTimelineContainer,
                      ShipmentBatchesContainer,
                      ShipmentContainersContainer,
                      ShipmentFilesContainer,
                      ShipmentTasksContainer,
                    ]}
                  >
                    {(
                      shipmentInfoContainer,
                      shipmentTagsContainer,
                      shipmentTransportTypeContainer,
                      shipmentTimelineContainer,
                      shipmentBatchesContainer,
                      shipmentContainersContainer,
                      shipmentFilesContainer,
                      shipmentTasksContainer
                    ) => {
                      const isDirty =
                        shipmentInfoContainer.isDirty() ||
                        shipmentTagsContainer.isDirty() ||
                        shipmentTransportTypeContainer.isDirty() ||
                        shipmentTimelineContainer.isDirty() ||
                        shipmentBatchesContainer.isDirty() ||
                        shipmentContainersContainer.isDirty() ||
                        shipmentFilesContainer.isDirty() ||
                        shipmentTasksContainer.isDirty();
                      return (
                        <>
                          {isNewOrClone ? (
                            <CancelButton
                              onClick={() => (onCancel ? onCancel() : this.onCancel())}
                            />
                          ) : (
                            <>
                              {isDirty && (
                                <ResetButton
                                  onClick={() => {
                                    this.initAllValues(
                                      {
                                        shipmentInfoContainer,
                                        shipmentTagsContainer,
                                        shipmentTransportTypeContainer,
                                        shipmentTimelineContainer,
                                        shipmentBatchesContainer,
                                        shipmentContainersContainer,
                                        shipmentFilesContainer,
                                        shipmentTasksContainer,
                                      },
                                      {
                                        ...shipmentInfoContainer.originalValues,
                                        ...shipmentTagsContainer.originalValues,
                                        ...shipmentTransportTypeContainer.originalValues,
                                        ...shipmentTimelineContainer.originalValues,
                                        ...shipmentBatchesContainer.originalValues,
                                        ...shipmentContainersContainer.originalValues,
                                        ...shipmentFilesContainer.originalValues,
                                        ...shipmentTasksContainer.originalValues,
                                      }
                                    );
                                    formContainer.onReset();
                                  }}
                                />
                              )}
                            </>
                          )}

                          {(isNewOrClone || isDirty) && (
                            <SaveButton
                              disabled={
                                !formContainer.isReady(
                                  {
                                    ...shipmentBatchesContainer.state,
                                    ...shipmentContainersContainer.state,
                                    ...shipmentFilesContainer.state,
                                    ...shipmentInfoContainer.state,
                                    ...shipmentTagsContainer.state,
                                    ...shipmentTimelineContainer.state,
                                    ...shipmentTransportTypeContainer.state,
                                    ...shipmentTasksContainer.state,
                                  },
                                  validator
                                )
                              }
                              isLoading={isLoading}
                              onClick={() => {
                                this.onSave(
                                  {
                                    ...shipmentBatchesContainer.originalValues,
                                    ...shipmentContainersContainer.originalValues,
                                    ...shipmentFilesContainer.originalValues,
                                    ...shipmentInfoContainer.originalValues,
                                    ...shipmentTagsContainer.originalValues,
                                    ...shipmentTimelineContainer.originalValues,
                                    ...shipmentTransportTypeContainer.originalValues,
                                    ...shipmentTasksContainer.originalValues,
                                  },
                                  shipmentBatchesContainer.existingBatches,
                                  {
                                    ...shipmentBatchesContainer.state,
                                    ...shipmentContainersContainer.state,
                                    ...shipmentFilesContainer.state,
                                    ...shipmentInfoContainer.state,
                                    ...shipmentTagsContainer.state,
                                    ...shipmentTimelineContainer.state,
                                    ...shipmentTransportTypeContainer.state,
                                    ...shipmentTasksContainer.state,
                                  },
                                  saveShipment,
                                  updateShipment => {
                                    this.initAllValues(
                                      {
                                        shipmentInfoContainer,
                                        shipmentTagsContainer,
                                        shipmentTransportTypeContainer,
                                        shipmentTimelineContainer,
                                        shipmentBatchesContainer,
                                        shipmentContainersContainer,
                                        shipmentFilesContainer,
                                        shipmentTasksContainer,
                                      },
                                      {
                                        ...updateShipment,
                                        hasCalledTasksApiYet: true,
                                        hasCalledBatchesApiYet: true,
                                        hasCalledTimelineApiYet: true,
                                        hasCalledContainerApiYet: true,
                                      }
                                    );
                                    formContainer.onReset();
                                  },
                                  formContainer.onErrors
                                );
                              }}
                            />
                          )}
                          {shipmentId && !isDirty && !isNewOrClone && (
                            <ExportButton
                              type="Shipment"
                              exportQuery={shipmentExportQuery}
                              variables={{ id: decodeId(shipmentId) }}
                            />
                          )}
                        </>
                      );
                    }}
                  </Subscribe>
                </CurrentNavBar>
                <Content>
                  {apiError && <p>Error: Please try again.</p>}
                  {this.isNew() || !shipmentId ? (
                    <UserConsumer>
                      {({ user }) => {
                        const { group } = user;
                        const { types = [] } = group;
                        const isImporter = types.includes('Importer');
                        const isExporter = types.includes('Exporter');
                        const isForwarder = types.includes('Forwarder');
                        return (
                          <>
                            <ShipmentForm
                              shipment={{}}
                              isNew
                              loading={false}
                              initDataForSlideView={initDataForSlideView}
                            />
                            <Subscribe
                              to={[
                                ShipmentInfoContainer,
                                ShipmentTagsContainer,
                                ShipmentTransportTypeContainer,
                                ShipmentTimelineContainer,
                                ShipmentBatchesContainer,
                                ShipmentContainersContainer,
                                ShipmentFilesContainer,
                                ShipmentTasksContainer,
                              ]}
                            >
                              {(
                                shipmentInfoContainer,
                                shipmentTagsContainer,
                                shipmentTransportTypeContainer,
                                shipmentTimelineContainer,
                                shipmentBatchesContainer,
                                shipmentContainersContainer,
                                shipmentFilesContainer,
                                shipmentTasksContainer
                              ) =>
                                this.onFormReady(
                                  {
                                    shipmentInfoContainer,
                                    shipmentTagsContainer,
                                    shipmentTransportTypeContainer,
                                    shipmentTimelineContainer,
                                    shipmentBatchesContainer,
                                    shipmentContainersContainer,
                                    shipmentFilesContainer,
                                    shipmentTasksContainer,
                                  },
                                  {
                                    id: uuid(),
                                    importer: isImporter ? group : null,
                                    exporter: isExporter ? group : null,
                                    forwarders: isForwarder ? [group] : [],
                                    inCharges: [],
                                    booked: false,
                                    customFields: {
                                      mask: null,
                                      fieldValues: [],
                                    },
                                    cargoReady: {},
                                    containerGroups: [{}],
                                    voyages: [{}],
                                    tags: [],
                                    todo: {
                                      tasks: [],
                                      taskTemplate: null,
                                    },
                                    files: [],
                                    containers: [],
                                    batches: [],
                                    ...initDataForSlideView,
                                  }
                                )
                              }
                            </Subscribe>
                          </>
                        );
                      }}
                    </UserConsumer>
                  ) : (
                    <QueryFormV2
                      query={shipmentFormQuery}
                      entityId={shipmentId}
                      entityType="shipment"
                      render={(shipment, { isLoading: loading, isOwner }) => (
                        <>
                          <ShipmentForm
                            loading={loading}
                            isOwner={isOwner}
                            isClone={this.isClone()}
                            shipment={shipment}
                            anchor={anchor}
                          />
                          <Subscribe
                            to={[
                              ShipmentInfoContainer,
                              ShipmentTagsContainer,
                              ShipmentTransportTypeContainer,
                              ShipmentTimelineContainer,
                              ShipmentBatchesContainer,
                              ShipmentContainersContainer,
                              ShipmentFilesContainer,
                              ShipmentTasksContainer,
                            ]}
                          >
                            {(
                              shipmentInfoContainer,
                              shipmentTagsContainer,
                              shipmentTransportTypeContainer,
                              shipmentTimelineContainer,
                              shipmentBatchesContainer,
                              shipmentContainersContainer,
                              shipmentFilesContainer,
                              shipmentTasksContainer
                            ) =>
                              this.onFormReady(
                                {
                                  shipmentInfoContainer,
                                  shipmentTagsContainer,
                                  shipmentTransportTypeContainer,
                                  shipmentTimelineContainer,
                                  shipmentBatchesContainer,
                                  shipmentContainersContainer,
                                  shipmentFilesContainer,
                                  shipmentTasksContainer,
                                },
                                shipment
                              )
                            }
                          </Subscribe>
                        </>
                      )}
                    />
                  )}
                </Content>
              </CurrentLayout>
            );
          }}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(ShipmentFormModule);
