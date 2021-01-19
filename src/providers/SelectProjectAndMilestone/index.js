/* eslint-disable */
// @flow
import * as React from 'react';
import { Query, useQuery } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { BooleanValue, ObjectValue } from 'react-values';
import type { Project, Milestone } from 'generated/graphql';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { currentSort } from 'components/common/FilterToolBar';
import { EntityIcon, SortInput, Search } from 'components/NavBar';
import { Display } from 'components/Form';
import { BaseButton, CancelButton } from 'components/Buttons';
import BaseCard from 'components/Cards';
import ProjectCard from 'components/Cards/ProjectCard';
import messages from 'modules/project/messages';
import useFilter from 'hooks/useFilter';
import useUser from 'hooks/useUser';
import SelectMilestone from './SelectMilestone';
import { selectProjectQuery } from './query';
import { ItemWrapperStyle, MilestoneWrapperStyle, MilestoneNameStyle } from './style';
import { SelectProjectAndMilestoneContent } from './components';

type OptionalProps = {
  cacheKey: string,
  parentEntityId?: string,
  milestone?: Milestone,
  saveButtonMessage: Object,
};

type Props = OptionalProps & {
  onCancel: () => void,
  onSelect: (milestone: ?Milestone) => void,
  intl: IntlShape,
};

const projectsDefaultQueryVariables = {
  perPage: 20,
  page: 1,
  filter: {
    query: '',
  },
  sort: { field: 'updatedAt', direction: 'DESCENDING' },
};

function resetSelection({
  project,
  milestone,
  set,
}: {
  project: ?Project,
  milestone: ?Milestone,
  set: Function,
}) {
  set('currentSelection', {
    project,
    milestone,
  });
}

const SelectProjectAndMilestone = ({
  cacheKey,
  intl,
  onCancel,
  onSelect,
  milestone,
  saveButtonMessage,
  parentEntityId,
}: Props) => {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];

  const { user } = useUser();

  // we only need to select projects owned by entity owner
  // and shared to the current logged in user's org
  const defaultVariables = React.useMemo(() => {
    const ownerQuery = JSON.parse(JSON.stringify(projectsDefaultQueryVariables));

    ownerQuery.filter.ownerId = parentEntityId ? parentEntityId : user.id;

    return ownerQuery;
  }, [parentEntityId]);

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(defaultVariables, cacheKey);

  const project = getByPath('project', milestone);

  return (
    <ObjectValue
      defaultValue={{
        selectedProject: project,
        selectedMilestone: milestone,
        currentSelection: {
          project,
          milestone,
        },
      }}
    >
      {({ value: { selectedProject, selectedMilestone, currentSelection }, set }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="PROJECT" color="PROJECT" />
            <SortInput
              sort={currentSort(sortFields, filterAndSort.sort)}
              ascending={filterAndSort.sort.direction !== 'DESCENDING'}
              fields={sortFields}
              onChange={({ field: { value }, ascending }) =>
                onChangeFilter({
                  ...filterAndSort,
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
            <Search
              query={filterAndSort.filter.query}
              onChange={newQuery =>
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, query: newQuery },
                })
              }
            />
            <CancelButton
              onClick={() => {
                set('selectedProject', project);
                set('selectedMilestone', milestone);
                onCancel();
              }}
            />
            <BaseButton
              id="save_button"
              label={saveButtonMessage}
              onClick={() => {
                if (selectedMilestone) {
                  onSelect({
                    ...selectedMilestone,
                    project: {
                      ...selectedProject,
                      milestones: selectedProject.milestones,
                    },
                  });
                } else {
                  onSelect(null);
                }
              }}
              disabled={
                getByPathWithDefault('', 'id', selectedMilestone) ===
                getByPathWithDefault('', 'id', milestone)
              }
              data-testid="btnSaveSelectProjectAndMilestone"
            />
          </SlideViewNavBar>

          <Content>
            <Query query={selectProjectQuery} variables={queryVariables} fetchPolicy="network-only">
              {({ loading, data, fetchMore, error }) => {
                if (error) {
                  return error.message;
                }
                const nextPage = getByPathWithDefault(1, 'projects.page', data) + 1;
                const totalPage = getByPathWithDefault(1, 'projects.totalPage', data);
                const hasMore = nextPage <= totalPage;
                const projects = getByPathWithDefault([], 'projects.nodes', data);
                return (
                  <GridView
                    items={projects}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'projects')}
                    hasMore={hasMore}
                    isLoading={loading}
                    isEmpty={projects.length === 0}
                    emptyMessage={
                      <FormattedMessage
                        id="modules.project.noFound"
                        defaultMessage="No projects found"
                      />
                    }
                    itemWidth="645px"
                  >
                    {projects.map(item => {
                      const selected =
                        item.id === getByPathWithDefault('', 'id', selectedProject) &&
                        selectedMilestone &&
                        selectedMilestone.id;

                      return (
                        <div key={item.id} className={ItemWrapperStyle}>
                          <BooleanValue>
                            {({ value: isOpen, set: slideToggle }) => (
                              <>
                                {item.id === getByPathWithDefault('', 'id', selectedProject) &&
                                  selectedMilestone &&
                                  selectedMilestone.id && (
                                    <div className={MilestoneWrapperStyle}>
                                      <BaseCard
                                        icon="MILESTONE"
                                        color="MILESTONE"
                                        selected
                                        selectable
                                        readOnly
                                      >
                                        <div className={MilestoneNameStyle}>
                                          <Display align="left">{selectedMilestone.name}</Display>
                                        </div>
                                      </BaseCard>
                                    </div>
                                  )}

                                <ProjectCard
                                  key={item.id}
                                  project={item}
                                  onClick={() => {
                                    set('currentSelection', {
                                      project: item,
                                      milestone: null,
                                    });
                                    slideToggle(true);
                                  }}
                                  selectable
                                  selected={selected}
                                />

                                {item.id ===
                                  getByPathWithDefault('', 'project.id', currentSelection) && (
                                  <SlideView
                                    shouldConfirm={() => {
                                      const button = document.getElementById(
                                        'select_milestone_save_button'
                                      );
                                      return button;
                                    }}
                                    isOpen={isOpen}
                                    onRequestClose={() => {
                                      resetSelection({
                                        project: selectedProject,
                                        milestone: selectedMilestone,
                                        set,
                                      });
                                      slideToggle(false);
                                    }}
                                  >
                                    {isOpen && (
                                      <SelectMilestone
                                        milestones={item.milestones}
                                        milestone={selectedMilestone}
                                        onCancel={() => {
                                          resetSelection({
                                            project: selectedProject,
                                            milestone: selectedMilestone,
                                            set,
                                          });
                                          slideToggle(false);
                                        }}
                                        onSelect={newMilestone => {
                                          if (newMilestone) {
                                            set('selectedMilestone', newMilestone);
                                            set('selectedProject', currentSelection.project);
                                            set('currentSelection', {
                                              project: currentSelection.project,
                                              milestone: newMilestone,
                                            });
                                          } else {
                                            set('selectedProject', null);
                                            set('selectedMilestone', null);
                                            set('currentSelection', {
                                              project: null,
                                              milestone: null,
                                            });
                                          }
                                          slideToggle(false);
                                        }}
                                      />
                                    )}
                                  </SlideView>
                                )}
                              </>
                            )}
                          </BooleanValue>
                        </div>
                      );
                    })}
                  </GridView>
                );
              }}
            </Query>
          </Content>
        </SlideViewLayout>
      )}
    </ObjectValue>
  );
};

SelectProjectAndMilestone.defaultProps = {
  cacheKey: 'SelectProjectAndMilestone',
  saveButtonMessage: (
    <FormattedMessage id="providers.selectProjectAndMilestone.save" defaultMessage="SAVE" />
  ),
};

export default injectIntl(SelectProjectAndMilestone);
