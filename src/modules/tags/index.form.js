// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';

import { Query, Mutation } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TagForm from './form';
import TagContainer from './form/containers';

import query from './form/query';
import { createTagMutation, updateTagMutation } from './form/mutation';

type Props = {
  tagId?: string,
};

const defaultProps = {
  tagId: '',
};

export default class TagFormContainer extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate('/tags');
  };

  onSave = (formData: Object, saveTag: Function, onSuccess: Function = () => {}) => {
    const { tagId } = this.props;
    const isNew = tagId === 'new';

    const { state } = formData;

    const input = {
      name: state.name,
      description: state.description,
      color: state.color,
      entityTypes: state.entityTypes,
    };

    if (isNew) {
      saveTag({ variables: { input } });
    } else if (tagId) {
      saveTag({ variables: { input, id: decodeId(tagId) } });
    }

    onSuccess();
  };

  onMutationCompleted = (result: Object) => {
    const { tagId } = this.props;
    const isNew = tagId === 'new';
    if (isNew) {
      const {
        tagCreate: {
          tagId: { id },
        },
      } = result;
      navigate(`/tags/${encodeId(id)}`);
    }
    logger.warn('result', result);
  };

  render() {
    const { tagId } = this.props;
    const isNew = tagId === 'new';

    let mutationKey = {};
    if (tagId && !isNew) {
      mutationKey = { key: decodeId(tagId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createTagMutation : updateTagMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveTag, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="TAGS" color="ORDER" />
                      <Subscribe to={[TagContainer, FormContainer]}>
                        {(tagState, form) =>
                          (isNew || tagState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={!form.isReady()}
                                onClick={() =>
                                  this.onSave({ ...tagState }, saveTag, () => {
                                    form.onReset();
                                  })
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

                  {isNew || !tagId ? (
                    <TagForm isNew />
                  ) : (
                    <Subscribe to={[TagContainer]}>
                      {tagState => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(tagId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            const { tag } = result;
                            tagState.initDetailValues(tag);
                          }}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }
                            if (loading) return <LoadingIcon />;

                            return <TagForm tag={getByPathWithDefault({}, 'tag', data)} />;
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
