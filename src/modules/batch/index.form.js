// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
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

class BatchFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/batch`);
  };

  onSave = (formData: Object, saveBatch: Function) => {
    const { batchId } = this.props;

    const isNew = batchId === 'new';
    const input = isNew ? prepareCreateBatchInput(formData) : prepareUpdateBatchInput(formData);

    if (isNew) {
      saveBatch({ variables: { input } });
    } else if (batchId) {
      saveBatch({ variables: { input, id: decodeId(batchId) } });
    }
  };

  onMutationCompleted = (result: Object) => {
    const { batchId } = this.props;
    const isNew = batchId === 'new';
    if (isNew) {
      const {
        createDeepOrder: { id },
      } = result;
      navigate(`/order/${encodeId(id)}`);
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
                    <NavBar>
                      <EntityIcon icon="BATCH" color="BATCH" />
                      <JumpToSection>
                        <SectionTabs link="batchSection" label="BATCH" icon="BATCH" />
                      </JumpToSection>
                      <Subscribe to={[BatchFormContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNew || formState.isDirty(formState.state)) && (
                            <>
                              <CancelButton disabled={false} onClick={this.onCancel} />
                              <SaveButton
                                disabled={!form.isReady()}
                                onClick={() => this.onSave(formState.state, saveBatch)}
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
                    <BatchForm batch={{}} />
                  ) : (
                    <Subscribe to={[BatchFormContainer]}>
                      {({ initDetailValues }) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(batchId) }}
                          fetchPolicy="network-only"
                          onCompleted={detail => initDetailValues(detail.batch)}
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
