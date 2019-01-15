// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import BatchForm from './form';
import BatchFormContainer from './form/container';
import validator from './form/validator';
import { batchFormQuery } from './form/query';
import {
  createBatchMutation,
  prepareCreateBatchInput,
  updateBatchMutation,
  prepareUpdateBatchInput,
  formatBatchInput,
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

  onReset = (formState: Object) => {
    resetFormState(formState);
  };

  onSave = async (
    formData: Object,
    saveBatch: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { batchId } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareCreateBatchInput(formData)
      : prepareUpdateBatchInput(formData);

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
    const isNewOrClone = this.isNewOrClone();
    if (isNewOrClone) {
      const {
        batchCreate: {
          batch: { id },
        },
      } = result;
      navigate(`/batch/${encodeId(id)}`);
    }
  };

  render() {
    const { batchId, isSlideView } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (batchId && !isNewOrClone) {
      mutationKey = { key: decodeId(batchId) };
    }

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
                    <NavBar>
                      <EntityIcon icon="BATCH" color="BATCH" />
                      <JumpToSection>
                        <SectionTabs
                          link="batchSection"
                          label={
                            <FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />
                          }
                          icon="BATCH"
                        />
                        <SectionTabs
                          link="quantityAdjustmentsSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.quantityAdjustments"
                              defaultMessage="QUANTITY ADJUSTMENTS"
                            />
                          }
                          icon="QUANTITY_ADJUSTMENTS"
                        />
                        <SectionTabs
                          link="packagingSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.packaging"
                              defaultMessage="PACKAGING"
                            />
                          }
                          icon="PACKAGING"
                        />
                        <SectionTabs
                          link="shipmentSection"
                          label={
                            <FormattedMessage
                              id="modules.Batches.shipment"
                              defaultMessage="SHIPMENT"
                            />
                          }
                          icon="SHIPMENT"
                        />
                        <SectionTabs
                          link="orderSection"
                          label={
                            <FormattedMessage id="modules.Batches.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                      </JumpToSection>
                      <Subscribe to={[BatchFormContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNewOrClone || formState.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton onClick={() => this.onCancel()} />
                              ) : (
                                <ResetButton onClick={() => this.onReset(formState)} />
                              )}
                              <SaveButton
                                disabled={!form.isReady(formState.state, validator)}
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    formatBatchInput(formState.state),
                                    saveBatch,
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
                  {apiError && <p>Error: Please try again.</p>}
                  {this.isNew() || !batchId ? (
                    <BatchForm batch={{}} isNew />
                  ) : (
                    <QueryForm
                      query={batchFormQuery}
                      entityId={batchId}
                      entityType="batch"
                      render={batch => (
                        <Subscribe to={[BatchFormContainer]}>
                          {({ initDetailValues }) => (
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
                                    ...batchClone
                                  } = batch;
                                  initDetailValues({
                                    ...batchClone,
                                    autoCalculatePackageQuantity: true,
                                    no: `[cloned] ${no}`,
                                    batchAdjustments: [],
                                  });
                                } else {
                                  initDetailValues(batch);
                                }
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
