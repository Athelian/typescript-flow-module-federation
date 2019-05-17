// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { showToastError } from 'utils/errors';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import BatchForm from './form';
import { BatchInfoContainer, BatchTasksContainer } from './form/containers';
import validator from './form/validator';
import { batchFormQuery } from './form/query';
import { createBatchMutation, updateBatchMutation, prepareParsedBatchInput } from './form/mutation';

type BatchFormState = {
  batchInfoContainer: Object,
  batchTasksContainer: Object,
};

type OptionalProps = {
  path: string,
  isSlideView: boolean,
};

type Props = OptionalProps & {
  batchId?: string,
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  batchId: '',
  isSlideView: false,
};

const formContainer = new FormContainer();
class BatchFormModule extends React.PureComponent<Props> {
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

  onCancel = () => navigate(`/batch`);

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveBatch: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { batchId } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedBatchInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData),
      {
        inBatchForm: true,
      }
    );

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

  onFormReady = ({ batchInfoContainer, batchTasksContainer }: BatchFormState) => (
    batch: Object
  ) => {
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
      batchTasksContainer.initDetailValues(todo);
    }
  };

  onMutationCompleted = ({ batchInfoContainer, batchTasksContainer }: BatchFormState) => (
    result: Object
  ) => {
    const { intl } = this.props;
    if (showToastError({ result, entity: 'batch', intl })) {
      return;
    }

    if (this.isNewOrClone()) {
      const { batchCreate } = result;
      navigate(`/batch/${encodeId(batchCreate.id)}`);
    } else {
      const { batchUpdate } = result;
      this.onFormReady({
        batchInfoContainer,
        batchTasksContainer,
      })(batchUpdate);
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
      <Provider inject={[formContainer]}>
        <UIConsumer>
          {uiState => (
            <Subscribe to={[BatchInfoContainer, BatchTasksContainer]}>
              {(batchInfoContainer, batchTasksContainer) => (
                <Mutation
                  mutation={isNewOrClone ? createBatchMutation : updateBatchMutation}
                  onCompleted={this.onMutationCompleted({
                    batchInfoContainer,
                    batchTasksContainer,
                  })}
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
                                <FormattedMessage
                                  id="modules.Batches.batch"
                                  defaultMessage="BATCH"
                                />
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
                                <FormattedMessage
                                  id="modules.Batches.order"
                                  defaultMessage="ORDER"
                                />
                              }
                              icon="ORDER"
                            />
                          </JumpToSection>

                          {(isNewOrClone ||
                            batchInfoContainer.isDirty() ||
                            batchTasksContainer.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton onClick={() => this.onCancel()} />
                              ) : (
                                <ResetButton
                                  onClick={() => {
                                    resetFormState(batchInfoContainer);
                                    resetFormState(batchTasksContainer, 'todo');
                                    formContainer.onReset();
                                  }}
                                />
                              )}
                              <SaveButton
                                disabled={
                                  !formContainer.isReady(
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
                                      formContainer.onReset();
                                    },
                                    formContainer.onErrors
                                  )
                                }
                                data-testid="btnSaveBatch"
                              />
                            </>
                          )}
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
                            <BatchForm
                              isClone={this.isClone()}
                              batch={batch}
                              onFormReady={() => {
                                this.onFormReady({
                                  batchInfoContainer,
                                  batchTasksContainer,
                                })(batch);
                              }}
                            />
                          )}
                        />
                      )}
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

export default injectIntl(BatchFormModule);
