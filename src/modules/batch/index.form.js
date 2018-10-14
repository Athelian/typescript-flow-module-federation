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
import { SaveButton, CancelButton } from 'components/Buttons';
import { FormContainer } from 'modules/form';
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
} from './form/mutation';

type OptionalProps = {
  isSlideView: boolean,
};
type Props = OptionalProps & {
  batchId?: string,
  path: string,
};

const defaultProps = {
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

  onCancel = () => {
    navigate(`/batch`);
  };

  onSave = async (
    formData: Object,
    saveBatch: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { batchId } = this.props;

    const isNewOrClone = this.isClone() || this.isNew();
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
    const isNewOrClone = this.isClone() || this.isNew();
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
    const isNewOrClone = this.isClone() || this.isNew();
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
                            <FormattedMessage id="modules.batch.batch" defaultMessage="BATCH" />
                          }
                          icon="BATCH"
                        />
                        <SectionTabs
                          link="quantityAdjustmentsSection"
                          label={
                            <FormattedMessage
                              id="modules.batch.quantityAdjustments"
                              defaultMessage="QUANTITY ADJUSTMENTS"
                            />
                          }
                          icon="QUANTITY_ADJUSTMENTS"
                        />
                        <SectionTabs
                          link="packagingSection"
                          label={
                            <FormattedMessage
                              id="modules.batch.packaging"
                              defaultMessage="PACKAGING"
                            />
                          }
                          icon="PACKAGING"
                        />
                        <SectionTabs
                          link="shipmentSection"
                          label={
                            <FormattedMessage
                              id="modules.batch.shipment"
                              defaultMessage="SHIPMENT"
                            />
                          }
                          icon="SHIPMENT"
                        />
                        <SectionTabs
                          link="orderSection"
                          label={
                            <FormattedMessage id="modules.batch.order" defaultMessage="ORDER" />
                          }
                          icon="ORDER"
                        />
                      </JumpToSection>
                      <Subscribe to={[BatchFormContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNewOrClone || formState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={!form.isReady(formState.state, validator)}
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    formState.state,
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
                              onChangeStatus={(formData, onSuccess) =>
                                this.onSave(formData, saveBatch, onSuccess)
                              }
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
                                    no: `${no}- clone`,
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
