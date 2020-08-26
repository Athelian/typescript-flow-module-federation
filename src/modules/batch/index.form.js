// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { UserConsumer } from 'contexts/Viewer';
import { showToastError } from 'utils/errors';
import { NavBar, EntityIcon, LogsButton } from 'components/NavBar';
import Timeline from 'modules/timeline/components/Timeline';
import SlideView from 'components/SlideView';
import { SlideViewLayout, SlideViewNavBar, Content } from 'components/Layout';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { FormContainer } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { getByPath } from 'utils/fp';
import { NAVIGABLE } from 'modules/batch/constants';
import BatchForm from './form';
import { BatchInfoContainer, BatchTasksContainer } from './form/containers';
import validator from './form/validator';
import { batchFormQuery, batchTimelineQuery } from './form/query';
import { updateBatchMutation, prepareParsedBatchInput } from './form/mutation';

type BatchFormState = {
  batchInfoContainer: Object,
  batchTasksContainer: Object,
};

type Props = {
  batchId: string,
  isSlideView: boolean,
  intl: IntlShape,
};

const formContainer = new FormContainer();
class BatchFormModule extends React.Component<Props> {
  componentWillUnmount() {
    formContainer.onReset();
  }

  onFormReady = (
    { batchInfoContainer, batchTasksContainer }: BatchFormState,
    batch: Object,
    timezone: string
  ) => {
    const hasInitialStateYet =
      (batchInfoContainer.state.id && batchInfoContainer.state.id === batch.id) ||
      Object.keys(batch).length === 0;
    if (hasInitialStateYet) return null;
    this.initAllValues({ batchInfoContainer, batchTasksContainer }, batch, timezone);
    return null;
  };

  initAllValues = (
    { batchInfoContainer, batchTasksContainer }: BatchFormState,
    batch: Object,
    timezone: string
  ) => {
    const { todo = { tasks: [] }, ...rest } = batch;
    batchInfoContainer.initDetailValues(rest, timezone);
    batchTasksContainer.initDetailValues(todo);
  };

  onSave = async (
    originalValues: Object,
    formData: Object,
    updateBatch: Function,
    onSuccess: Object => void,
    onErrors: Function
  ) => {
    const { batchId } = this.props;
    const input = prepareParsedBatchInput(
      removeTypename(originalValues),
      removeTypename(formData),
      { inBatchForm: true }
    );
    const result = await updateBatch({ variables: { id: decodeId(batchId), input } });
    if (result && result.data) {
      const { data } = result;
      const violations = getByPath('batchUpdate.violations', data);
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('batchUpdate', data));
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    const { intl } = this.props;
    showToastError({ result, intl, entity: 'batch' });
  };

  render() {
    const { batchId, isSlideView } = this.props;
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    let mutationKey = {};
    if (batchId) {
      mutationKey = { key: decodeId(batchId) };
    }
    return (
      <UserConsumer>
        {({ user }) => (
          <Provider inject={[formContainer]}>
            <Mutation
              mutation={updateBatchMutation}
              onCompleted={(result: Object) => this.onMutationCompleted(result)}
              {...mutationKey}
            >
              {(updateBatch, { loading, error }) => (
                <>
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
                        link="batch_quantitySection"
                        label={
                          <FormattedMessage
                            id="modules.Batches.quantity"
                            defaultMessage="QUANTITY"
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
                        label={<FormattedMessage id="modules.Batches.task" defaultMessage="TASK" />}
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

                    <Subscribe to={[BatchInfoContainer, BatchTasksContainer]}>
                      {(batchInfoContainer, batchTasksContainer) => (
                        <>
                          <BooleanValue>
                            {({ value: isOpen, set: toggleLogs }) => (
                              <>
                                <LogsButton
                                  entityType="batch"
                                  entityId={batchId}
                                  onClick={() => toggleLogs(true)}
                                />
                                <SlideView isOpen={isOpen} onRequestClose={() => toggleLogs(false)}>
                                  <SlideViewLayout>
                                    {batchId && isOpen && (
                                      <>
                                        <SlideViewNavBar>
                                          <EntityIcon icon="LOGS" color="LOGS" />
                                        </SlideViewNavBar>

                                        <Content>
                                          <Timeline
                                            query={batchTimelineQuery}
                                            queryField="batch"
                                            variables={{
                                              id: decodeId(batchId),
                                            }}
                                            entity={{
                                              batchId: decodeId(batchId),
                                            }}
                                            users={[
                                              ...(batchInfoContainer.state.shipment?.followers ||
                                                []),
                                              ...(batchInfoContainer.state.orderItem?.order
                                                ?.followers || []),
                                            ]}
                                          />
                                        </Content>
                                      </>
                                    )}
                                  </SlideViewLayout>
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                          {(batchInfoContainer.isDirty() || batchTasksContainer.isDirty()) && (
                            <>
                              <ResetFormButton
                                onClick={() => {
                                  this.initAllValues(
                                    {
                                      batchInfoContainer,
                                      batchTasksContainer,
                                    },
                                    {
                                      ...batchInfoContainer.originalValues,
                                      ...batchTasksContainer.originalValues,
                                    },
                                    user.timezone
                                  );
                                  formContainer.onReset();
                                }}
                              />
                              <SaveFormButton
                                id="batch_form_save_button"
                                disabled={
                                  !formContainer.isReady(
                                    { ...batchInfoContainer.state, ...batchTasksContainer.state },
                                    validator
                                  )
                                }
                                isLoading={loading}
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...batchInfoContainer.originalValues,
                                      ...batchTasksContainer.originalValues,
                                    },
                                    { ...batchInfoContainer.state, ...batchTasksContainer.state },
                                    updateBatch,
                                    updateData => {
                                      this.initAllValues(
                                        {
                                          batchInfoContainer,
                                          batchTasksContainer,
                                        },
                                        updateData,
                                        user.timezone
                                      );
                                      formContainer.onReset();
                                    },
                                    formContainer.onErrors
                                  )
                                }
                                data-testid="btnSaveBatch"
                              />
                            </>
                          )}
                        </>
                      )}
                    </Subscribe>
                  </CurrentNavBar>
                  {error && <p>Error: Please try again.</p>}
                  <Content>
                    <QueryForm
                      query={batchFormQuery}
                      entityId={batchId}
                      entityType="batch"
                      render={batch => (
                        <>
                          <BatchForm
                            batch={batch}
                            itemConfig={NAVIGABLE}
                            shipmentConfig={NAVIGABLE}
                            containerConfig={NAVIGABLE}
                            orderConfig={NAVIGABLE}
                          />
                          <Subscribe to={[BatchInfoContainer, BatchTasksContainer]}>
                            {(batchInfoContainer, batchTasksContainer) =>
                              this.onFormReady(
                                {
                                  batchInfoContainer,
                                  batchTasksContainer,
                                },
                                batch,
                                user.timezone
                              )
                            }
                          </Subscribe>
                        </>
                      )}
                    />
                  </Content>
                </>
              )}
            </Mutation>
          </Provider>
        )}
      </UserConsumer>
    );
  }
}

export default injectIntl(BatchFormModule);
