// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { TAG_CREATE } from 'modules/permission/constants/tag';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  TagFilterConfig,
  TagSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import TagList from './list';
import { tagsExportQuery } from './query';

const TagListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'tag_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="TAG" color="TAG" subIcon="CARDS" />

        <Filter config={TagFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={TagSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(TAG_CREATE) && (
          <Link to="/tags/new">
            <NewButton data-testid="newButton" />
          </Link>
        )}
        <ExportButton
          type="Tags"
          exportQuery={tagsExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
          }}
        />
      </NavBar>
      <TagList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default TagListModule;
