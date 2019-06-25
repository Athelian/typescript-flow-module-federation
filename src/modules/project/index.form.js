// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { showToastError } from 'utils/errors';
import type { ProjectPayload, Project } from 'generated/graphql';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import logger from 'utils/logger';
import { getByPath } from 'utils/fp';
import { FormContainer } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import Timeline from 'modules/timeline/components/Timeline';
import QueryForm from 'components/common/QueryForm';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import NavBar, { EntityIcon, SlideViewNavBar, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { decodeId } from 'utils/id';
import { removeTypename } from 'utils/data';
import { projectTimelineQuery } from './query';
import ProjectForm from './form';
import validator from './form/validator';
import {
  ProjectInfoContainer,
  ProjectTagsContainer,
  ProjectMilestonesContainer,
} from './form/containers';
import { projectFormQuery } from './form/query';
import {
  createProjectMutation,
  updateProjectMutation,
  prepareParsedProjectInput,
} from './form/mutation';

type OptionalProps = {
  path: string,
  isSlideView: boolean,
  redirectAfterSuccess: boolean,
  onSuccessCallback: ?Function,
  onCancel?: Function,
  initDataForSlideView: Object,
};

type Props = OptionalProps & {
  projectId?: string,
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  projectId: '',
  isSlideView: false,
  onSuccessCallback: null,
  redirectAfterSuccess: true,
  initDataForSlideView: {},
};

const formContainer = new FormContainer();
class ProjectFormModule extends React.PureComponent<Props> {
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

  onCancel = () => navigate('/project');

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveProject: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { projectId, onSuccessCallback } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedProjectInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData)
    );

    if (isNewOrClone) {
      const { data } = await saveProject({ variables: { input } });
      if (!data) return;

      const {
        projectCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('projectCreate', data));
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    } else if (projectId) {
      const { data } = await saveProject({ variables: { input, id: decodeId(projectId) } });
      if (!data) return;

      const {
        projectUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('projectUpdate', data));
        if (onSuccessCallback) {
          onSuccessCallback(data);
        }
      }
    }
  };

  initAllValues = (
    { projectInfoState, projectTagsState, projectMilestonesState }: Object,
    project: Project
  ) => {
    const {
      tags = [],
      milestones = [
        {
          total: 0,
          completed: 0,
          dueDate: null,
          isCompleted: false,
          name: '',
        },
      ],
      ...info
    } = project;
    projectInfoState.initDetailValues(info);
    projectTagsState.initDetailValues(tags);
    projectMilestonesState.initDetailValues(milestones);
    return null;
  };

  onFormReady = (
    { projectInfoState, projectTagsState, projectMilestonesState }: Object,
    project: Project
  ) => {
    const hasInitialStateYet = projectInfoState.state.id || Object.keys(project).length === 0;
    if (hasInitialStateYet) return null;
    this.initAllValues(
      {
        projectInfoState,
        projectTagsState,
        projectMilestonesState,
      },
      project
    );
    return null;
  };

  onMutationCompleted = (
    result: { projectCreate: ProjectPayload } | { projectUpdate: ProjectPayload }
  ) => {
    const { intl } = this.props;

    showToastError({ intl, result, entity: 'project' });
  };

  render() {
    const { projectId, isSlideView, onCancel } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (projectId && !isNewOrClone) {
      mutationKey = { key: decodeId(projectId) };
    }
    const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

    return (
      <UIConsumer>
        {uiState => (
          <Provider inject={[formContainer]}>
            <Mutation
              mutation={isNewOrClone ? createProjectMutation : updateProjectMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveProject, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...(isSlideView ? {} : uiState)}
                  navBar={
                    <CurrentNavBar>
                      <EntityIcon icon="PROJECT" color="PROJECT" />
                      <JumpToSection>
                        <SectionTabs
                          link="project_projectSection"
                          label={
                            <FormattedMessage
                              id="modules.Projects.project"
                              defaultMessage="PROJECT"
                            />
                          }
                          icon="PROJECT"
                        />
                      </JumpToSection>
                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) =>
                          !isNewOrClone && (
                            <>
                              <LogsButton onClick={() => slideToggle(true)} />
                              <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                                <Layout
                                  navBar={
                                    <SlideViewNavBar>
                                      <EntityIcon icon="LOGS" color="LOGS" />
                                    </SlideViewNavBar>
                                  }
                                >
                                  {projectId && opened ? (
                                    <Timeline
                                      query={projectTimelineQuery}
                                      queryField="project"
                                      variables={{
                                        id: decodeId(projectId),
                                      }}
                                      entity={{
                                        projectId: decodeId(projectId),
                                      }}
                                    />
                                  ) : null}
                                </Layout>
                              </SlideView>
                            </>
                          )
                        }
                      </BooleanValue>
                      <Subscribe
                        to={[
                          ProjectInfoContainer,
                          ProjectTagsContainer,
                          ProjectMilestonesContainer,
                          FormContainer,
                        ]}
                      >
                        {(projectInfoState, projectTagsState, projectMilestonesState, form) => {
                          const isDirty =
                            projectInfoState.isDirty() ||
                            projectTagsState.isDirty() ||
                            projectMilestonesState.isDirty();

                          return (
                            <>
                              {isNewOrClone ? (
                                <CancelButton
                                  onClick={() => (onCancel ? onCancel() : this.onCancel())}
                                />
                              ) : (
                                <>
                                  {isDirty && (
                                    <ResetButton
                                      onClick={() => {
                                        this.initAllValues(
                                          {
                                            projectInfoState,
                                            projectTagsState,
                                            projectMilestonesState,
                                          },
                                          {
                                            ...projectInfoState.originalValues,
                                            ...projectTagsState.originalValues,
                                            ...projectMilestonesState.originalValues,
                                          }
                                        );
                                        form.onReset();
                                      }}
                                    />
                                  )}
                                </>
                              )}

                              {(isNewOrClone || isDirty) && (
                                <SaveButton
                                  disabled={
                                    !form.isReady(
                                      {
                                        ...projectInfoState.state,
                                        ...projectTagsState.state,
                                        ...projectMilestonesState.state,
                                      },
                                      validator
                                    )
                                  }
                                  isLoading={isLoading}
                                  onClick={() =>
                                    this.onSave(
                                      {
                                        ...projectInfoState.originalValues,
                                        ...projectTagsState.originalValues,
                                        ...projectMilestonesState.originalValues,
                                      },
                                      {
                                        ...projectInfoState.state,
                                        ...projectTagsState.state,
                                        ...projectMilestonesState.state,
                                      },
                                      saveProject,
                                      updateProject => {
                                        this.initAllValues(
                                          {
                                            projectInfoState,
                                            projectTagsState,
                                            projectMilestonesState,
                                          },
                                          updateProject
                                        );
                                        form.onReset();
                                      },
                                      form.onErrors
                                    )
                                  }
                                />
                              )}
                            </>
                          );
                        }}
                      </Subscribe>
                    </CurrentNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  {this.isNew() || !projectId ? (
                    <ProjectForm isNew />
                  ) : (
                    <QueryForm
                      query={projectFormQuery}
                      entityId={projectId}
                      entityType="project"
                      onCompleted={logger.warn}
                      render={(project, isOwner) => (
                        <>
                          <ProjectForm
                            project={project}
                            isOwner={isOwner}
                            isClone={this.isClone()}
                          />
                          <Subscribe
                            to={[
                              ProjectInfoContainer,
                              ProjectTagsContainer,
                              ProjectMilestonesContainer,
                            ]}
                          >
                            {(projectInfoState, projectTagsState, projectMilestonesState) =>
                              this.onFormReady(
                                {
                                  projectInfoState,
                                  projectTagsState,
                                  projectMilestonesState,
                                },
                                project
                              )
                            }
                          </Subscribe>
                        </>
                      )}
                    />
                  )}
                </Layout>
              )}
            </Mutation>
          </Provider>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ProjectFormModule);
