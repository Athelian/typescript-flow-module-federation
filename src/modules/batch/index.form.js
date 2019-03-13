// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import BatchForm from './form';
import { BatchInfoContainer, BatchTasksContainer } from './form/containers';
import validator from './form/validator';
import { batchFormQuery } from './form/query';
import {
  createBatchMutation,
  prepareCreateBatchInput,
  updateBatchMutation,
  prepareParsedUpdateBatchInput,
} from './form/mutation';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
};

type Props = OptionalProps & {
  batchId?: string,
};

const defaultProps = {
  path: '',
  batchId: '',
  isSlideView: false,
};

class BatchFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate(`/batch`);

  onReset = ({
    batchInfoContainer,
    batchTasksContainer,
    form,
  }: {
    batchInfoContainer: Object,
    batchTasksContainer: Object,
    form: Object,
  }) => {
    resetFormState(batchInfoContainer);
    resetFormState(batchTasksContainer, 'tasks');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveBatch: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { batchId } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareCreateBatchInput(formData)
      : prepareParsedUpdateBatchInput(originalValues, formData, {
          inShipmentForm: false,
          inOrderForm: false,
          inContainerForm: false,
          inBatchForm: true,
        });

    if (isNewOrClone) {
      const { data } = await saveBatch({ variables: { input } });
      const {
        batchCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (batchId) {
      const { data } = await saveBatch({ variables: { input, id: decodeId(batchId) } });
      const {
        batchUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    if (!result) {
      toast.error('There was an error. Please try again later');
      return;
    }

    const isNewOrClone = this.isNewOrClone();
    if (isNewOrClone) {
      const { batchCreate } = result;
      navigate(`/batch/${encodeId(batchCreate.id)}`);
    }
  };

  render() {
    const { batchId, isSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (batchId && !isNewOrClone) {
      mutationKey = { key: decodeId(batchId) };
    }

    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;
    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createBatchMutation : updateBatchMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveBatch, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...(isSlideView ? {} : uiState)}
                  navBar={
                    <CurrentNavBar>
                      <EntityIcon icon="BATCH" color="BATCH" />
                      <JumpToSection>
                        <SectionTabs
                          link="batch_batchSection"
                          label={
                            <FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />
                          }
                          icon="BATCH"
                        />
                        <SectionTabs
                          link="batch_quantityAdjustmentsSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.quantityAdjustments"
                              defaultMessage="QUANTITY ADJUSTMENTS"
                            />
                          }
                          icon="QUANTITY_ADJUSTMENTS"
                        />
                        <SectionTabs
                          link="batch_packagingSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.packaging"
                              defaultMessage="PACKAGING"
                            />
                          }
                          icon="PACKAGING"
                        />
                        <SectionTabs
                          link="batch_taskSection"
                          label={
                            <FormattedMessage id="modules.Batches.task" defaultMessage="TASK" />
                          }
                          icon="TASK"
                        />
                        <SectionTabs
                          link="batch_shipmentSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.shipment"
                              defaultMessage="SHIPMENT"
                            />
                          }
                          icon="SHIPMENT"
                        />
                        <SectionTabs
                          link="batch_containerSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.container"
                              defaultMessage="CONTAINER"
                            />
                          }
                          icon="CONTAINER"
                        />
                        <SectionTabs
                          link="batch_orderSection"
                          label={
                            <FormattedMessage id="modules.Batches.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                      </JumpToSection>

                      <Subscribe to={[BatchInfoContainer, BatchTasksContainer, FormContainer]}>
                        {(batchInfoContainer, batchTasksContainer, form) =>
                          (isNewOrClone ||
                            batchInfoContainer.isDirty() ||
                            batchTasksContainer.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton onClick={() => this.onCancel()} />
                              ) : (
                                <ResetButton
                                  onClick={() =>
                                    this.onReset({ batchInfoContainer, batchTasksContainer, form })
                                  }
                                />
                              )}
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    { ...batchInfoContainer.state, ...batchTasksContainer.state },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...batchInfoContainer.originalValues,
                                      ...batchTasksContainer.originalValues,
                                    },
                                    { ...batchInfoContainer.state, ...batchTasksContainer.state },
                                    saveBatch,
                                    () => {
                                      batchInfoContainer.onSuccess();
                                      batchTasksContainer.onSuccess();
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
                    </CurrentNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {this.isNew() || !batchId ? (
                    <BatchForm batch={{}} isNew />
                  ) : (
                    <QueryForm
                      query={batchFormQuery}
                      entityId={batchId}
                      entityType="batch"
                      render={batch => (
                        <Subscribe to={[BatchInfoContainer, BatchTasksContainer]}>
                          {(batchInfoContainer, batchTaskContainer) => (
                            <BatchForm
                              isClone={this.isClone()}
                              batch={batch}
                              onFormReady={() => {
                                if (this.isClone()) {
                                  const {
                                    archived,
                                    updatedBy,
                                    updatedAt,
                                    deliveredAt,
                                    expiredAt,
                                    producedAt,
                                    no,
                                    todo,
                                    ...batchClone
                                  } = batch;
                                  batchInfoContainer.initDetailValues({
                                    ...batchClone,
                                    autoCalculatePackageQuantity: true,
                                    no: `[cloned] ${no}`,
                                    batchAdjustments: [],
                                  });
                                } else {
                                  const { todo, ...rest } = batch;
                                  batchInfoContainer.initDetailValues(rest);
                                }
                                batchTaskContainer.initDetailValues(batch.todo);
                              }}
                            />
                          )}
                        </Subscribe>
                      )}
                    />
                  )}
                </Layout>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default BatchFormModule;
