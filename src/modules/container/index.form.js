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

import { containerFormQuery } from './form/query';
import { updateContainerMutation, prepareUpdateContainerInput } from './form/mutation';
import ContainerFormContainer from './form/container';
import validator from './form/validator';
import ContainerForm from './form/index';

type OptionalProps = {
  containerId: string,
};

type Props = OptionalProps & {};

const defaultProps = {
  containerId: '',
};

export default class ContainerFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onReset = (formState: Object) => {
    resetFormState(formState);
  };

  onCancel = () => navigate(`/batch`);

  onSave = async (
    formData: Object,
    saveBatch: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { containerId } = this.props;

    const input = prepareUpdateContainerInput(formData);

    const { data } = await saveBatch({
      variables: { input, id: decodeId(containerId) },
    });
    const {
      containerUpdate: { violations },
    } = data;
    if (violations && violations.length) {
      onErrors(violations);
    } else {
      onSuccess();
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
            <Mutation mutation={updateContainerMutation} {...mutationKey}>
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
                      <Subscribe to={[ContainerFormContainer, FormContainer]}>
                        {(formState, form) =>
                          formState.isDirty() && (
                            <>
                              <ResetButton onClick={() => this.onReset(formState)} />
                              <SaveButton
                                disabled={!form.isReady(formState.state, validator)}
                                isLoading={loading}
                                onClick={() =>
                                  this.onSave(
                                    formState.state,
                                    saveContainer,
                                    () => {
                                      formState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
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

                      return (
                        <Subscribe to={[ContainerFormContainer]}>
                          {({ initDetailValues }) => (
                            <ContainerForm
                              container={usefulContainer}
                              onFormReady={() => initDetailValues(usefulContainer)}
                            />
                          )}
                        </Subscribe>
                      );
                    }}
                  />
                </Layout>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
