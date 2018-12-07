// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import Icon from 'components/Icon';
import { SearchInput } from 'components/NavBar';
import ToggleButton from 'modules/relationMap/common/SortFilter/AdvancedFilter/ToggleButton';
import {
  MiniSelectorWrapperStyle,
  MiniSelectorSearchWrapperStyle,
  MiniSelectorStatusTogglesWrapperStyle,
  MiniSelectorBodyWrapperStyle,
} from './style';
import messages from '../messages';

type OptionalProps = {
  hideToggles: boolean,
};

type Props = OptionalProps & {
  renderItem: (item: Object) => React.Node,
  entityType: string,
  query: any,
  filterBy: Object,
};

const defaultProps = {
  hideToggles: false,
};

export const filterByStatus = (isActive: boolean, isArchive: boolean) => {
  if (isActive && isArchive) {
    return {};
  }
  if (!isActive && !isArchive) {
    return {
      query: 'FAKE QUERY FOR RETURN NULL DATA',
    };
  }
  return {
    archived: isArchive,
  };
};

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function MiniSelector({
  renderItem,
  entityType,
  query,
  filterBy,
  hideToggles,
}: Props) {
  const [searchText, setSearchText] = React.useState(filterBy.query);
  const [isActive, setIsActive] = React.useState(true);
  const [isArchive, setIsArchive] = React.useState(true);
  const prevEntity = usePrevious(entityType);
  React.useEffect(() => {
    // reset state when change the entity
    if (prevEntity && prevEntity !== entityType) {
      setSearchText('');
      setIsActive(true);
      setIsArchive(true);
    }
  });
  return (
    <div className={MiniSelectorWrapperStyle}>
      <div className={MiniSelectorSearchWrapperStyle}>
        {!hideToggles && (
          <>
            <div className={MiniSelectorStatusTogglesWrapperStyle}>
              <Icon icon="ACTIVE" />
              <ToggleButton
                isOn={isActive}
                onClick={() => (isActive ? setIsActive(false) : setIsActive(true))}
              />
            </div>
            <div className={MiniSelectorStatusTogglesWrapperStyle}>
              <Icon icon="ARCHIVE" />
              <ToggleButton
                isOn={isArchive}
                onClick={() => (isArchive ? setIsArchive(false) : setIsArchive(true))}
              />
            </div>
          </>
        )}
        <SearchInput
          name="query"
          value={searchText}
          onChange={setSearchText}
          onClear={() => setSearchText('')}
        />
      </div>
      <div className={MiniSelectorBodyWrapperStyle}>
        <Query
          query={query}
          variables={{
            page: 1,
            perPage: 10,
            filterBy: {
              ...filterBy,
              query: searchText,
              ...(!hideToggles ? filterByStatus(isActive, isArchive) : {}),
            },
          }}
          fetchPolicy="network-only"
        >
          {({ loading: isLoading, data, fetchMore, error }) => {
            if (error) {
              return error.message;
            }

            const nextPage = getByPathWithDefault(1, `${entityType}.page`, data) + 1;
            const totalPage = getByPathWithDefault(1, `${entityType}.totalPage`, data);
            const hasMore = nextPage <= totalPage;

            const items = getByPathWithDefault([], `${entityType}.nodes`, data);
            const onLoadMore = () => loadMore({ fetchMore, data }, filterBy, entityType);

            return (
              <GridView
                onLoadMore={onLoadMore}
                hasMore={hasMore}
                isLoading={isLoading}
                itemWidth="200px"
                isEmpty={items.length === 0}
                emptyMessage={<FormattedMessage {...messages.noDataFound} />}
                padding="0"
                gap="5px"
              >
                {items.map(item => renderItem(item))}
              </GridView>
            );
          }}
        </Query>
      </div>
    </div>
  );
}

MiniSelector.defaultProps = defaultProps;
