// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { BooleanValue, ObjectValue } from 'react-values';
import type { DateRangeInput, Project, Milestone } from 'generated/graphql';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { ProjectCard } from 'components/Cards';
import messages from 'modules/project/messages';
import useSortAndFilter from 'hooks/useSortAndFilter';
import SelectMilestone from './SelectMilestone';
import { selectProjectQuery } from './query';
import { ItemWrapperStyle } from './style';

type Props = {
  onCancel: () => void,
  onSelect: (selectedProject: ?Project, selectedMilestone: ?Milestone) => mixed,
  filter: {
    query?: string,
    createdAt?: DateRangeInput,
    updatedAt?: DateRangeInput,
    dueDate?: DateRangeInput,
  },
  intl: IntlShape,
  project: ?Project,
  milestone: ?Milestone,
};

function initFilterBy(filter: Object) {
  return {
    perPage: 20,
    page: 1,
    filter: {
      query: '',
      ...filter,
    },
    sort: { field: 'updatedAt', direction: 'DESCENDING' },
  };
}

function resetSelection({
  selectedProject,
  selectedMilestone,
  set,
}: {
  selectedProject: ?Project,
  selectedMilestone: ?Milestone,
  set: Function,
}) {
  set('currentSelection', {
    project: selectedProject,
    milestone: selectedMilestone,
  });
}

function SelectProjectAndMilestone({
  intl,
  onCancel,
  onSelect,
  filter,
  project,
  milestone,
}: Props) {
  const fields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];
  const {
    filterAndSort: filtersAndSort,
    queryVariables,
    onChangeFilter: onChange,
  } = useSortAndFilter(initFilterBy(filter));

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
        <Layout
          navBar={
            <SlideViewNavBar>
              <EntityIcon icon="PROJECT" color="PROJECT" />
              <SortInput
                sort={fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]}
                ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
                fields={fields}
                onChange={({ field: { value }, ascending }) =>
                  onChange({
                    ...filtersAndSort,
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  })
                }
              />
              <SearchInput
                value={filtersAndSort.filter.query}
                name="search"
                onClear={() =>
                  onChange({
                    ...filtersAndSort,
                    filter: { ...filtersAndSort.filter, query: '' },
                  })
                }
                onChange={newQuery =>
                  onChange({
                    ...filtersAndSort,
                    filter: { ...filtersAndSort.filter, query: newQuery },
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
              <SaveButton
                disabled={
                  !(
                    getByPathWithDefault('', 'id', selectedProject) !==
                      getByPathWithDefault('', 'id', project) &&
                    getByPathWithDefault('', 'id', selectedMilestone) !==
                      getByPathWithDefault('', 'id', milestone)
                  )
                }
                onClick={() => onSelect(selectedProject, selectedMilestone)}
              />
            </SlideViewNavBar>
          }
        >
          <Query
            key={JSON.stringify(queryVariables)}
            query={selectProjectQuery}
            variables={queryVariables}
            fetchPolicy="network-only"
          >
            {({ loading, data, fetchMore, error }) => {
              if (error) {
                return error.message;
              }
              const nextPage = getByPathWithDefault(1, 'project.page', data) + 1;
              const totalPage = getByPathWithDefault(1, 'projects.totalPage', data);
              const hasMore = nextPage <= totalPage;
              const projects = getByPathWithDefault([], 'projects.nodes', data);
              return (
                <GridView
                  items={projects}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'projects')}
                  hasMore={hasMore}
                  isLoading={loading}
                  isEmpty={projects.length === 0}
                  emptyMessage={
                    <FormattedMessage
                      id="modules.project.noFound"
                      defaultMessage="No projects found"
                    />
                  }
                  itemWidth="200px"
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
                                selectedMilestone.id && <h3>{selectedMilestone.name}</h3>}
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
                                  isOpen={isOpen}
                                  onRequestClose={() => {
                                    resetSelection({
                                      selectedProject,
                                      selectedMilestone,
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
                                          selectedProject,
                                          selectedMilestone,
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
        </Layout>
      )}
    </ObjectValue>
  );
}

export default injectIntl(SelectProjectAndMilestone);
