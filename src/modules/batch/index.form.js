// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import Setting from 'modules/setting';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import LoadingIcon from 'components/LoadingIcon';
import { FormContainer } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import BatchForm from './form';
import BatchFormContainer from './form/container';
import validator from './form/validator';
import query from './form/query';
import {
  createBatchMutation,
  prepareCreateBatchInput,
  updateBatchMutation,
  prepareUpdateBatchInput,
} from './form/mutation';

type Props = {
  batchId?: string,
};

const defaultProps = {
  batchId: '',
};

class BatchFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

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

    const isNew = batchId === 'new';
    const input = isNew ? prepareCreateBatchInput(formData) : prepareUpdateBatchInput(formData);

    if (isNew) {
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
    const { batchId } = this.props;
    const isNew = batchId === 'new';
    if (isNew) {
      const {
        batchCreate: {
          batch: { id },
        },
      } = result;
      navigate(`/batch/${encodeId(id)}`);
    }
  };

  render() {
    const { batchId } = this.props;
    const isNew = batchId === 'new';
    let mutationKey = {};
    if (batchId && !isNew) {
      mutationKey = { key: decodeId(batchId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createBatchMutation : updateBatchMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveBatch, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar setting={<Setting />}>
                      <EntityIcon icon="BATCH" color="BATCH" />
                      <JumpToSection>
                        <SectionTabs link="batchSection" label="BATCH" icon="BATCH" />
                        <SectionTabs
                          link="quantityAdjustmentsSection"
                          label="QUANTITY ADJUSTMENTS"
                          icon="QUANTITY_ADJUSTMENTS"
                        />
                        <SectionTabs link="packagingSection" label="PACKAGING" icon="PACKAGING" />
                      </JumpToSection>
                      <Subscribe to={[BatchFormContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNew || formState.isDirty()) && (
                            <>
                              <CancelButton disabled={false} onClick={this.onCancel} />
                              <SaveButton
                                disabled={!form.isReady(formState.state, validator)}
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
                  {isLoading && <LoadingIcon />}
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !batchId ? (
                    <BatchForm batch={{}} isNew />
                  ) : (
                    <Subscribe to={[BatchFormContainer]}>
                      {({ initDetailValues }) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(batchId) }}
                          fetchPolicy="network-only"
                          onCompleted={detail => {
                            if (detail.batch) {
                              initDetailValues(detail.batch);
                            } else {
                              navigate('/404');
                            }
                          }}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }

                            if (loading) return <LoadingIcon />;
                            return <BatchForm batch={getByPathWithDefault({}, 'batch', data)} />;
                          }}
                        </Query>
                      )}
                    </Subscribe>
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
