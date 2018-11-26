// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import Icon from 'components/Icon';
import { orderListQuery } from 'modules/order/list/query';
import { SearchInput } from 'components/NavBar';
import { ToggleButton } from 'modules/relationMap/common/SortFilter/AdvancedFilter/components';
import {
  MiniSelectorWrapperStyle,
  MiniSelectorSearchWrapperStyle,
  MiniSelectorStatusTogglesWrapperStyle,
  MiniSelectorBodyWrapperStyle,
} from './style';
import messages from '../messages';
import { MiniSelectorItem } from '..';

type OptionalProps = {
  hideToggles?: boolean,
};

type Props = OptionalProps & {
  renderItem: (item: Object) => React.Node,
  entityType: string,
  query: any,
  filterBy: Object,
};

const defaultProps = {
  renderItem: (item: Object) => <MiniSelectorItem item={item}>CHANGE ME</MiniSelectorItem>,
  entityType: 'orders',
  query: orderListQuery,
  filterBy: {
    query: '',
    archived: false,
  },
  hideToggles: false,
};

export default function MiniSelector({
  renderItem,
  entityType,
  query,
  filterBy,
  hideToggles,
}: Props) {
  return (
    <div className={MiniSelectorWrapperStyle}>
      <div className={MiniSelectorSearchWrapperStyle}>
      {!hideToggles && (
          <>
            <div className={MiniSelectorStatusTogglesWrapperStyle}>
              <Icon icon="ACTIVE" />
              <ToggleButton isOn />
            </div>
            <div className={MiniSelectorStatusTogglesWrapperStyle}>
              <Icon icon="ARCHIVE" />
              <ToggleButton isOn />
            </div>
          </>
        )}
        <SearchInput name="hardcoded" value="" onChange={() => {}} onClear={() => {}} />
      </div>
      <div className={MiniSelectorBodyWrapperStyle}>
        <Query
          query={query}
          variables={{
            page: 1,
            perPage: 10,
            filterBy,
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
