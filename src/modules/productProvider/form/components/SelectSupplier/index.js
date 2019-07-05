// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ObjectValue } from 'react-values';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import useSortAndFilter from 'hooks/useSortAndFilter';
import FilterToolBar from 'components/common/FilterToolBar';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import messages from 'modules/partner/messages';
import { PartnerCard } from 'components/Cards';

type Props = {|
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
  intl: IntlShape,
|};

const getInitFilter = (): Object => {
  return {
    filter: {
      types: ['Supplier'],
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };
};

const partnerPath = 'viewer.user.group.partners';

const SelectSupplier = ({ selected, onCancel, onSelect, intl }: Props) => {
  const { filterAndSort, queryVariables, onChangeFilter } = useSortAndFilter(getInitFilter());
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.code), value: 'code' },
  ];
  return (
    <PartnerListProvider {...queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.group,
          code: item.code,
        }));
        const nextPage = getByPathWithDefault(1, `${partnerPath}.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${partnerPath}.totalPage`, data);
        const hasMore = nextPage <= totalPage;

        return (
          <ObjectValue defaultValue={selected}>
            {({ value, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="PARTNER"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      disabled={isEquals(value, selected)}
                      onClick={() => onSelect(value)}
                    />
                  </SlideViewNavBar>
                }
              >
                <PartnerGridView
                  hasMore={hasMore}
                  isLoading={loading}
                  onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, partnerPath)}
                  items={items}
                  renderItem={item => (
                    <PartnerCard
                      partner={item}
                      onSelect={() => {
                        if (value && item.id === value.id) {
                          set(null);
                        } else {
                          set(item);
                        }
                      }}
                      selectable
                      selected={value && item.id === value.id}
                      key={item.id}
                    />
                  )}
                />
              </Layout>
            )}
          </ObjectValue>
        );
      }}
    </PartnerListProvider>
  );
};

export default injectIntl(SelectSupplier);
