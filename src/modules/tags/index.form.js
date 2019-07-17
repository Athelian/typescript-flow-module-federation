// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { decodeId, encodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { QueryForm } from 'components/common';
import { Content } from 'components/Layout';
import Portal from 'components/Portal';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton, ExportButton } from 'components/Buttons';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import TagForm from './form';
import { TagContainer, EntityTypeContainer } from './form/containers';
import { tagFormQuery } from './form/query';
import validator from './form/validator';
import { createTagMutation, updateTagMutation, prepareParsedTagInput } from './form/mutation';
import { tagExportQuery } from './query';

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
  tagContainer: Object,
  entityTypeContainer: Object,
};

export default class TagFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => navigate('/tags');

  onReset = ({ tagContainer, entityTypeContainer, form }: TagFormState & { form: Object }) => {
    resetFormState(tagContainer);
    resetFormState(entityTypeContainer, 'entityTypes');
    form.onReset();
  };

  onSave = async (
    originalValues: Object,
    value: Object,
    saveTag: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { tagId } = this.props;
    const input = prepareParsedTagInput(
      this.isNewOrClone() ? null : removeTypename(originalValues),
      removeTypename(value)
    );

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
        <Mutation
          mutation={isNewOrClone ? createTagMutation : updateTagMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveTag, { loading: isLoading, error: apiError }) => (
            <>
              <Portal>
                <EntityIcon icon="TAG" color="TAG" />
                <JumpToSection>
                  <SectionTabs
                    link="tag_tagSection"
                    label={<FormattedMessage id="modules.Tags.tag" defaultMessage="TAG" />}
                    icon="TAG"
                  />
                </JumpToSection>
                <Subscribe to={[TagContainer, EntityTypeContainer, FormContainer]}>
                  {(tagContainer, entityTypeContainer, form) => (
                    <>
                      {(isNewOrClone ||
                        tagContainer.isDirty() ||
                        entityTypeContainer.isDirty()) && (
                        <>
                          {this.isNewOrClone() ? (
                            <CancelButton onClick={() => this.onCancel()} />
                          ) : (
                            <ResetButton
                              onClick={() => {
                                this.onReset({
                                  tagContainer,
                                  entityTypeContainer,
                                  form,
                                });
                              }}
                            />
                          )}
                          <SaveButton
                            data-testid="saveButton"
                            disabled={
                              !form.isReady(
                                { ...tagContainer.state, ...entityTypeContainer.state },
                                validator
                              )
                            }
                            isLoading={isLoading}
                            onClick={() =>
                              this.onSave(
                                {
                                  ...tagContainer.originalValues,
                                  ...entityTypeContainer.originalValues,
                                },
                                { ...tagContainer.state, ...entityTypeContainer.state },
                                saveTag,
                                () => {
                                  tagContainer.onSuccess();
                                  entityTypeContainer.onSuccess();
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        </>
                      )}

                      {tagId &&
                        !tagContainer.isDirty() &&
                        !entityTypeContainer.isDirty() &&
                        !isNewOrClone && (
                          <ExportButton
                            type="Tag"
                            exportQuery={tagExportQuery}
                            variables={{ id: decodeId(tagId) }}
                          />
                        )}
                    </>
                  )}
                </Subscribe>
              </Portal>
              <Content>
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
                        {(tagContainer, entityTypeContainer) => (
                          <TagForm
                            isNew={isNewOrClone}
                            tag={tag}
                            onFormReady={() => {
                              const {
                                name = null,
                                description = null,
                                color = '#cccccc',
                                entityTypes = [],
                              } = tag;
                              tagContainer.initDetailValues({ name, description, color });
                              entityTypeContainer.initDetailValues(entityTypes);
                            }}
                          />
                        )}
                      </Subscribe>
                    )}
                  />
                )}
              </Content>
            </>
          )}
        </Mutation>
      </Provider>
    );
  }
}
