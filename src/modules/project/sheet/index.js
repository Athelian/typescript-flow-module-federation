// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, ProjectFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig, useSheet, useExportedColumns } from 'components/Sheet';
import ColumnsGroup from 'components/ColumnsGroup';
import { clone } from 'utils/fp';
import { projectsExportQuery } from '../query';
import MilestoneTaskColumnsConfigGroup from './MilestoneTaskColumnsConfigGroup';
import { computeProjectColumnConfigsFromTemplate, useProjectColumnStates } from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import decorate from './decorator';
import { projectsQuery } from './query';

const ProjectSheetModule = () => {
  const client = useApolloClient();
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);
  const getItems = React.useCallback(
    data => ({ ...data?.projects, nodes: decorate(clone(data?.projects?.nodes ?? [])) }),
    []
  );

  const {
    initialItems,
    loading,
    hasMore,
    onLoadMore,
    query,
    setQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
  } = useSheet({
    itemsQuery: projectsQuery,
    initialFilterBy: { query: '' },
    initialSortBy: { updatedAt: 'DESCENDING' },
    sorter,
    getItems,
    cacheKey: 'project_sheet',
  });
  const { columns, setColumns, columnStates } = useProjectColumnStates({
    sortBy,
    setSortBy,
    cacheKey: 'project_sheet',
  });
  const exportVariables = useExportedColumns(columnStates);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="PROJECT" color="PROJECT" subIcon="TABLE" />

        <Filter config={ProjectFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig
          columns={columns}
          templateType="ProjectSheet"
          onChange={setColumns}
          onLoadTemplate={computeProjectColumnConfigsFromTemplate}
        >
          {({ getGroupProps }) => (
            <>
              <ColumnsGroup {...getGroupProps('PROJECT')} />
              {(() => {
                // TODO: bypass the flow error from custom group
                const { columns: milestoneColumns, icon, onChange } = (getGroupProps(
                  'MILESTONE_TASK'
                ): any);
                return (
                  <MilestoneTaskColumnsConfigGroup
                    columns={milestoneColumns}
                    icon={icon}
                    onChange={onChange}
                  />
                );
              })()}
            </>
          )}
        </ColumnsConfig>
        <ExportButton
          type="Projects"
          exportQuery={projectsExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
            ...exportVariables,
          }}
        />
      </NavBar>

      <Sheet
        columns={columnStates}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLoadMore={onLoadMore}
        onItemsSort={sorter}
        actions={{}}
      />
    </Content>
  );
};

export default ProjectSheetModule;
