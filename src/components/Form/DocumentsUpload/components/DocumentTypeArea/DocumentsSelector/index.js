// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { isForbidden } from 'utils/data';
import { canViewFile } from 'utils/file';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { DocumentCard } from 'components/Cards';
import {
  EntityIcon,
  Filter,
  FileFilterConfig,
  FileSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import DocumentGridView from 'modules/document/list/DocumentGridView';
import { documentListQuery } from './query';

type Props = {
  onCancel: Function,
  onSelect: Function,
  alreadyAddedDocuments: Array<Object>,
};

const RenderItem = ({ file, selectItemProps }: {| file: FilePayload, selectItemProps: any |}) => {
  const hasPermissions = useViewerHasPermissions();
  const canView = canViewFile(hasPermissions, file.type);
  if (!canView) return null;

  return <DocumentCard key={file.id} file={file} hideParentInfo {...selectItemProps} />;
};

const DocumentsSelector = ({ onCancel, onSelect, alreadyAddedDocuments }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', hasEntity: false },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    documentListQuery,
    {
      variables: {
        filterBy: { query, excludeIds: alreadyAddedDocuments.map(file => file.id), ...filterBy },
        sortBy,
        page: 1,
        perPage: 20,
      },
      fetchPolicy: 'network-only',
    },
    'files'
  );

  return (
    <Selector.Many selected={[]}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="DOCUMENT" color="DOCUMENT" />

            <Filter
              config={FileFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['hasEntity']}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={FileSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="saveButtonOnSelectDocuments"
              disabled={!dirty}
              onClick={() => onSelect(value)}
            />
          </SlideViewNavBar>

          <Content>
            <DocumentGridView
              files={nodes.filter(file => !isForbidden(file))}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={file => <RenderItem file={file} selectItemProps={getItemProps(file)} />}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
};

export default DocumentsSelector;
