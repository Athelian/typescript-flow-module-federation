// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ContainerSortConfig,
  ContainerFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ContainerCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps } from '../Common/Ids';
import { containersQuery, containersByIDsQuery } from './query';
import { CardStyle } from './style';

const ContainerSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    containersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'containers'
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many selected={selected.map(id => ({ id }))}>
        {({ value, dirty, getItemProps }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="CONTAINER" color="CONTAINER" />
              <Filter config={ContainerFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
              <Search query={query} onChange={setQuery} />
              <Sort config={ContainerSortConfig} sortBy={sortBy} onChange={setSortBy} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={!dirty}
                onClick={() => setSelected(value.map(container => container.id))}
              />
            </SlideViewNavBar>

            <Content>
              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                isEmpty={nodes.length === 0}
                emptyMessage={null}
                itemWidth="195px"
              >
                {nodes.map(container => (
                  <ContainerCard
                    key={container?.id}
                    container={container}
                    {...getItemProps(container)}
                  />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
    </SlideView>
  );
};

const ContainerIds = ({ value, readonly, onChange }: FilterInputProps<Array<string>>) => (
  <Ids
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={<FormattedMessage {...messages.containers} />}
    selector={ContainerSelector}
    query={containersByIDsQuery}
    getItems={data => data?.containersByIDs ?? []}
    renderItem={container => (
      <BaseCard icon="CONTAINER" color="CONTAINER" wrapperClassName={CardStyle}>
        <Display height="30px">{container?.no}</Display>
      </BaseCard>
    )}
  />
);

export default ContainerIds;
