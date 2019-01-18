// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId, encodeId } from 'utils/id';
import TagForm from './form';
import { TagContainer, EntityTypeContainer } from './form/containers';
import { tagFormQuery } from './form/query';
import validator from './form/validator';
import { createTagMutation, updateTagMutation } from './form/mutation';

type OptionalProps = {
  path: string,
};

type Props = OptionalProps & {
  tagId?: string,
};

const defaultProps = {
  path: '',
  tagId: '',
};
type TagFormState = {
  tagState: Object,
  entityTypesState: Object,
};

export default class TagFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => navigate('/tags');

  onReset = ({ tagState, entityTypesState }: TagFormState) => {
    resetFormState(tagState);
    resetFormState(entityTypesState, 'entityTypes');
  };

  onSave = async (
    formData: Object,
    saveTag: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { tagId } = this.props;

    const { name, description, color, entityTypes } = formData;

    const input = {
      name,
      description,
      color,
      entityTypes,
    };

    if (this.isNewOrClone()) {
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
  };

  onMutationCompleted = (result: Object) => {
    if (this.isNewOrClone()) {
      const { tagCreate } = result;
      navigate(`/tags/${encodeId(tagCreate.id)}`);
    }
  };

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  render() {
    const { tagId } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (tagId && !isNewOrClone) {
      mutationKey = { key: decodeId(tagId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createTagMutation : updateTagMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveTag, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="TAG" color="TAG" />
                      <JumpToSection>
                        <SectionTabs
                          link="tagSection"
                          label={<FormattedMessage id="modules.Tags.tag" defaultMessage="TAG" />}
                          icon="TAG"
                        />
                      </JumpToSection>
                      <Subscribe to={[TagContainer, EntityTypeContainer, FormContainer]}>
                        {(tagState, entityTypesState, form) =>
                          (isNewOrClone || tagState.isDirty() || entityTypesState.isDirty()) && (
                            <>
                              {this.isNewOrClone() ? (
                                <CancelButton onClick={() => this.onCancel()} />
                              ) : (
                                <ResetButton
                                  onClick={() =>
                                    this.onReset({
                                      tagState,
                                      entityTypesState,
                                    })
                                  }
                                />
                              )}
                              <SaveButton
                                data-testid="saveButton"
                                disabled={
                                  !form.isReady(
                                    { ...tagState.state, ...entityTypesState.state },
                                    validator
                                  )
                                }
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    { ...tagState.state, ...entityTypesState.state },
                                    saveTag,
                                    () => {
                                      tagState.onSuccess();
                                      entityTypesState.onSuccess();
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
                  {!tagId ? (
                    <TagForm tag={{}} isNew />
                  ) : (
                    <QueryForm
                      query={tagFormQuery}
                      entityId={tagId}
                      entityType="tag"
                      render={tag => (
                        <Subscribe to={[TagContainer, EntityTypeContainer]}>
                          {(tagState, entityTypesState) => (
                            <TagForm
                              isNew={isNewOrClone}
                              tag={tag}
                              onFormReady={() => {
                                const { name, description, color, entityTypes } = tag;
                                tagState.initDetailValues({ name, description, color });
                                entityTypesState.initDetailValues(entityTypes);
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
