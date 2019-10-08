// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { UserConsumer } from 'components/Context/Viewer';
import { getByPath } from 'utils/fp';
import { showToastError } from 'utils/errors';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { removeTypename } from 'utils/data';
import { FormContainer } from 'modules/form';
import { initValues as taskInitValues } from 'modules/shipment/form/containers/tasks';
import { SaveButton, CancelButton } from 'components/Buttons';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { uuid } from 'utils/id';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
  ShipmentFilesContainer,
  ShipmentInfoContainer,
  ShipmentTagsContainer,
  ShipmentTimelineContainer,
  ShipmentTransportTypeContainer,
  ShipmentTasksContainer,
} from 'modules/shipment/form/containers';
import ShipmentForm from 'modules/shipment/form';
import validator from 'modules/shipment/form/validator';
import { createShipmentMutation, prepareParsedShipmentInput } from 'modules/shipment/form/mutation';

type Props = {|
  onSuccessCallback: ?Function,
  onCancel?: Function,
  initDataForSlideView: Object,
  intl: IntlShape,
|};

type CreateShipmentResponse = {|
  shipmentCreate: {
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

class NewShipmentForm extends React.PureComponent<Props> {
  onSave = async (
    originalValues: Object,
    existingBatches: Array<Object>,
    newValues: Object,
    saveShipment: Function,
    onSuccess: Object => void,
    onErrors: (Array<Object>) => void
  ) => {
    const { onSuccessCallback } = this.props;

    const input = prepareParsedShipmentInput({
      originalValues: null,
      existingBatches: removeTypename(existingBatches),
      newValues: removeTypename(newValues),
    });

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
      hasCalledFilesApiYet = false,
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
    shipmentFilesContainer.initDetailValues(files, hasCalledFilesApiYet);
    shipmentTasksContainer.initDetailValues(todo, hasCalledTasksApiYet || todo.tasks.length > 0);
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
    return null;
  };

  onMutationCompleted = (result: CreateShipmentResponse) => {
    const { intl } = this.props;

    showToastError({ result, intl, entity: 'shipment' });
  };

  render() {
    const { onCancel, initDataForSlideView } = this.props;
    return (
      <Mutation mutation={createShipmentMutation} onCompleted={this.onMutationCompleted}>
        {(saveShipment, { loading: isLoading, error: apiError }) => {
          return (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                <JumpToSection>
                  <SectionTabs
                    link="shipment_shipmentSection"
                    label={
                      <FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />
                    }
                    icon="SHIPMENT"
                  />
                  <SectionTabs
                    link="shipment_timelineSection"
                    label={
                      <FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />
                    }
                    icon="TIMELINE"
                  />
                  <SectionTabs
                    link="shipment_cargoSection"
                    label={<FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO" />}
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
                    label={<FormattedMessage id="modules.Shipments.task" defaultMessage="TASKS" />}
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
                    FormContainer,
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
                    shipmentTasksContainer,
                    formContainer
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
                        <CancelButton onClick={onCancel} />

                        {isDirty && (
                          <SaveButton
                            id="shipment_form_save_button"
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
                                      hasCalledFilesApiYet: true,
                                    }
                                  );
                                  formContainer.onReset();
                                },
                                formContainer.onErrors
                              );
                            }}
                          />
                        )}
                      </>
                    );
                  }}
                </Subscribe>
              </SlideViewNavBar>
              <Content>
                {apiError && <p>Error: Please try again.</p>}
                <UserConsumer>
                  {({ organization }) => {
                    const { types = [] } = organization;
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
                                importer: isImporter ? organization : null,
                                exporter: isExporter ? organization : null,
                                forwarders: isForwarder ? [organization] : [],
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
              </Content>
            </SlideViewLayout>
          );
        }}
      </Mutation>
    );
  }
}

export default injectIntl(NewShipmentForm);
