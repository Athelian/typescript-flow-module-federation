// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import BatchForm from './form';
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
              {(saveOrder, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="BATCH" color="BATCH" />
                    </NavBar>
                  }
                >
                  {isLoading && <LoadingIcon />}
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !batchId ? (
                    <BatchForm batch={{}} />
                  ) : (
                    <Query
                      query={query}
                      variables={{ id: decodeId(batchId) }}
                      fetchPolicy="network-only"
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
