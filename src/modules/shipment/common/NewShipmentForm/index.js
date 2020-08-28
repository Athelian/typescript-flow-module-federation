// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { getByPath } from 'utils/fp';
import { showToastError } from 'utils/errors';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { removeTypename } from 'utils/data';
import { FormContainer } from 'modules/form';
import { initValues as taskInitValues } from 'modules/shipment/form/containers/tasks';
import { CancelButton } from 'components/Buttons';
import SaveFormButton from 'components/SaveFormButton';
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
import { UserConsumer } from 'contexts/Viewer';

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

const formContainer = new FormContainer();
class NewShipmentForm extends React.PureComponent<Props> {
  componentWillUnmount() {
    formContainer.onReset();
  }

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
    },
    shipment: Object,
    timezone: string
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
    shipmentInfoContainer.initDetailValues(info, timezone);
    shipmentBatchesContainer.initDetailValues(
      batches,
      hasCalledBatchesApiYet || batches.length > 0,
      timezone
    );
    shipmentContainersContainer.initDetailValues(
      containers,
      hasCalledContainerApiYet || containers.length > 0,
      timezone
    );
    shipmentTimelineContainer.initDetailValues(
      {
        cargoReady,
        voyages,
        containerGroups,
      },
      hasCalledTimelineApiYet,
      timezone
    );
    shipmentFilesContainer.initDetailValues(files, hasCalledFilesApiYet);
    shipmentTasksContainer.initDetailValues(todo, hasCalledTasksApiYet || todo.tasks.length > 0);
    shipmentTagsContainer.initDetailValues(tags);
    shipmentTransportTypeContainer.initDetailValues(transportType);
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
    },
    shipment: Object,
    timezone: string
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
      shipment,
      timezone
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
      <UserConsumer>
        {({ user, organization }) => (
          <Provider inject={[formContainer]}>
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
                            <FormattedMessage
                              id="modules.Shipments.order"
                              defaultMessage="ORDERS"
                            />
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
                          form
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
                                <SaveFormButton
                                  id="shipment_form_save_button"
                                  disabled={
                                    !form.isReady(
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
                                          },
                                          user.timezone
                                        );
                                        form.onReset();
                                      },
                                      form.onErrors
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
                              booked: false,
                              customFields: {
                                mask: null,
                                fieldValues: [],
                              },
                              cargoReady: {},
                              containerGroups: [{}],
                              voyages: [{}],
                              tags: [],
                              followers: [{ ...user, organization }],
                              todo: {
                                tasks: [],
                                taskTemplate: null,
                              },
                              files: [],
                              containers: [],
                              batches: [],
                              ...initDataForSlideView,
                            },
                            user.timezone
                          )
                        }
                      </Subscribe>
                    </Content>
                  </SlideViewLayout>
                );
              }}
            </Mutation>
          </Provider>
        )}
      </UserConsumer>
    );
  }
}

export default injectIntl(NewShipmentForm);
