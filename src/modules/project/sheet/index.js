// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, ProjectFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import {
  Sheet,
  ColumnsConfig,
  useSheet,
  useResizedColumns,
  type ColumnConfig,
} from 'components/Sheet';
import { clone } from 'utils/fp';
import { projectsExportQuery } from '../query';
import MilestoneTaskColumnsConfigGroup from './MilestoneTaskColumnsConfigGroup';
import { computeProjectColumnConfigsFromTemplate, useProjectColumns } from './columns';
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
    localSortBy,
    onLocalSort,
    onRemoteSort,
  } = useSheet({
    itemsQuery: projectsQuery,
    initialFilterBy: { query: '' },
    initialSortBy: { updatedAt: 'DESCENDING' },
    sorter,
    getItems,
    cacheKey: 'project_sheet',
  });
  const [columns, setColumns] = useProjectColumns('project_sheet');

  const [resizedColumns, onColumnResize] = useResizedColumns(columns, 'project_sheet');

  /**
   * Add a prefix to each milestone and task columns title.
   * For milestone columns: #{milestone index + 1} {title}
   * For tasks columns: #{milestone index + 1}-{task index + 1} {title}
   *
   * @type {Array<ColumnsConfig>}
   */
  const columnsWithPrefix = React.useMemo<Array<ColumnConfig>>(
    () =>
      resizedColumns.map(col => {
        if (col.key.startsWith('milestones')) {
          let matches = col.key.match(/milestones\.(\d+)/);
          if (matches) {
            const milestoneIdx = parseFloat(matches[1]);

            if (col.key.startsWith(`milestones.${milestoneIdx}.tasks`)) {
              matches = col.key.match(/milestones\.\d+\.tasks.(\d+)/);
              if (matches) {
                const taskIdx = parseFloat(matches[1]);

                return {
                  ...col,
                  title: (
                    <>
                      #{milestoneIdx + 1}-{taskIdx + 1} {col.title}
                    </>
                  ),
                };
              }
            }

            return {
              ...col,
              title: (
                <>
                  #{milestoneIdx + 1} {col.title}
                </>
              ),
            };
          }
        }

        return col;
      }),
    [resizedColumns]
  );

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
              <ColumnsConfig.Group {...getGroupProps('PROJECT')} />
              <MilestoneTaskColumnsConfigGroup {...getGroupProps('MILESTONE_TASK')} />
            </>
          )}
        </ColumnsConfig>
        <ExportButton
          type="Projects"
          exportQuery={projectsExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
            localSortBy,
            columns: columns.filter(c => !!c.exportKey).map(c => c.exportKey),
          }}
        />
      </NavBar>

      <Sheet
        columns={columnsWithPrefix}
        loading={loading}
        items={initialItems}
        hasMore={hasMore}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLocalSort={onLocalSort}
        onRemoteSort={onRemoteSort}
        onLoadMore={onLoadMore}
        onColumnResize={onColumnResize}
        actions={{}}
      />
    </Content>
  );
};

export default ProjectSheetModule;
