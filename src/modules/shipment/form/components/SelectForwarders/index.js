// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { Partner } from 'generated/graphql';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import PartnerListProvider from 'providers/PartnerList';
import useSortAndFilter from 'hooks/useSortAndFilter';
import FilterToolBar from 'components/common/FilterToolBar';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import messages from 'modules/partner/messages';
import { PartnerCard } from 'components/Cards';

type Props = {|
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Partner) => void,
  onCancel: Function,
  intl: IntlShape,
|};

const MAX_SELECTIONS = 4;

function onSelectForwarders({
  selected,
  isSelected,
  item,
  push,
  set,
}: {
  isSelected: boolean,
  selected: Array<{
    id: string,
    name: string,
  }>,
  item: Partner,
  push: Function,
  set: Function,
}) {
  if (!isSelected) {
    if (selected.length < MAX_SELECTIONS) push(item);
  } else {
    set(selected.filter((orderItem: Object) => orderItem.id !== item.id));
  }
}

const getInitFilter = (): Object => {
  return {
    filter: {
      types: ['Forwarder'],
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

const SelectForwarders = ({ selected, onCancel, onSelect, intl }: Props) => {
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
          <ArrayValue defaultValue={selected}>
            {({ value: values, push, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="PARTNER"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    <h3>
                      {values.length}/{MAX_SELECTIONS}
                    </h3>
                    <CancelButton disabled={false} onClick={onCancel} />
                    <SaveButton
                      disabled={isEquals(values, selected)}
                      onClick={() => onSelect(values)}
                    />
                  </SlideViewNavBar>
                }
              >
                <PartnerGridView
                  hasMore={hasMore}
                  isLoading={loading}
                  onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, partnerPath)}
                  items={items}
                  renderItem={item => {
                    const isSelected = values.map(({ id }) => id).includes(item.id);
                    return (
                      <PartnerCard
                        partner={item}
                        key={item.id}
                        onSelect={() =>
                          onSelectForwarders({ selected: values, isSelected, item, push, set })
                        }
                        selectable
                        selected={isSelected}
                      />
                    );
                  }}
                />
              </Layout>
            )}
          </ArrayValue>
        );
      }}
    </PartnerListProvider>
  );
};

export default injectIntl(SelectForwarders);
