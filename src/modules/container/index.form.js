// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { decodeId } from 'utils/id';
import { formatToDateTimeInput } from 'utils/date';
import { isNullOrUndefined } from 'utils/fp';
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
import ContainerFormContainer from './form/container';
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

export default class ContainerFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onReset = (containerContainer: Object, form: Object) => {
    resetFormState(containerContainer);
    form.onReset();
  };

  onCancel = () => navigate(`/batch`);

  onSave = async (
    originalValues: Object,
    existingBatches: Array<Object>,
    newValues: Object,
    saveContainer: Function,
    onSuccess: Function = () => {},
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
          onSuccess();
        }
      }
    }
  };

  onFormReady = ({ containerContainer }: { containerContainer: Object }) => (container: Object) => {
    containerContainer.initDetailValues(container);
  };

  onMutationCompleted = ({ containerContainer }: { containerContainer: Object }) => (
    result: UpdateContainerResponse
  ) => {
    if (result && result.containerUpdate) {
      const { containerUpdate } = result;
      const { violations } = containerUpdate;
      if (isNullOrUndefined(violations)) {
        this.onFormReady({ containerContainer })(containerUpdate);
      }
    }
  };

  render() {
    const { containerId } = this.props;

    if (containerId === '') return null;

    const mutationKey = { key: decodeId(containerId) };

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Subscribe to={[ContainerFormContainer, FormContainer]}>
              {(containerContainer, form) => (
                <Mutation
                  mutation={updateContainerMutation}
                  onCompleted={this.onMutationCompleted({ containerContainer })}
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
                          {containerContainer.isDirty() && (
                            <>
                              <ResetButton onClick={() => this.onReset(containerContainer, form)} />
                              <SaveButton
                                disabled={!form.isReady(containerContainer.state, validator)}
                                isLoading={loading}
                                onClick={() =>
                                  this.onSave(
                                    containerContainer.originalValues,
                                    containerContainer.existingBatches,
                                    containerContainer.state,
                                    saveContainer,
                                    () => {
                                      containerContainer.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
                                  )
                                }
                              />
                            </>
                          )}
                        </NavBar>
                      }
                    >
                      {error && <p>Error: Please try again.</p>}
                      <QueryForm
                        query={containerFormQuery}
                        entityId={containerId}
                        entityType="container"
                        onCompleted={({ container }) => {
                          if (container) {
                            this.onFormReady({ containerContainer })(container);
                          }
                        }}
                        render={container => {
                          const {
                            warehouseArrivalAgreedDate,
                            warehouseArrivalActualDate,
                            ...rest
                          } = container;
                          const usefulContainer = {
                            ...(isNullOrUndefined(warehouseArrivalAgreedDate)
                              ? {}
                              : {
                                  warehouseArrivalAgreedDate: formatToDateTimeInput(
                                    warehouseArrivalAgreedDate
                                  ),
                                }),
                            ...(isNullOrUndefined(warehouseArrivalActualDate)
                              ? {}
                              : {
                                  warehouseArrivalActualDate: formatToDateTimeInput(
                                    warehouseArrivalActualDate
                                  ),
                                }),
                            ...rest,
                          };

                          return <ContainerForm container={usefulContainer} />;
                        }}
                      />
                    </Layout>
                  )}
                </Mutation>
              )}
            </Subscribe>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
