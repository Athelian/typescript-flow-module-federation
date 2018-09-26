// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TagForm from './form';
import { TagContainer, EntityTypeContainer } from './form/containers';
import query from './form/query';
import validator from './form/validator';
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

  onSave = async (
    formData: Object,
    saveTag: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { tagId } = this.props;
    const isNew = tagId === 'new';

    const { name, description, color, entityTypes } = formData;

    const input = {
      name,
      description,
      color,
      entityTypes,
    };

    if (isNew) {
      const { data } = await saveTag({ variables: { input } });
      const {
        tagCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (tagId) {
      const { data } = await saveTag({ variables: { input, id: decodeId(tagId) } });
      const {
        tagUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }

    onSuccess();
  };

  onMutationCompleted = (result: Object) => {
    const { tagId } = this.props;
    const isNew = tagId === 'new';
    if (isNew) {
      const {
        tagCreate: {
          tag: { id },
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
                      <EntityIcon icon="TAGS" color="TAGS" />
                      <Subscribe to={[TagContainer, EntityTypeContainer, FormContainer]}>
                        {(tagState, entityTypesState, form) =>
                          (isNew || tagState.isDirty() || entityTypesState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    { ...tagState.state, ...entityTypesState.state },
                                    validator
                                  )
                                }
                                onClick={() =>
                                  this.onSave(
                                    { ...tagState.state, ...entityTypesState.state },
                                    saveTag,
                                    () => {
                                      tagState.onSuccess();
                                      entityTypesState.onSuccess();
                                      form.onReset();
                                    }
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

                  {isNew || !tagId ? (
                    <TagForm isNew />
                  ) : (
                    <Subscribe to={[TagContainer, EntityTypeContainer]}>
                      {(tagState, entityTypesState) => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(tagId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            const {
                              tag: { name, description, color, entityTypes },
                            } = result;
                            tagState.initDetailValues({ name, description, color });
                            entityTypesState.initDetailValues(entityTypes);
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
