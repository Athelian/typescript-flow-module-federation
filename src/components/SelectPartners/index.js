// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import PartnerListProvider from 'providers/PartnerList';
import FilterToolBar from 'components/common/FilterToolBar';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import messages from 'modules/partner/messages';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {|
  partnerTypes: Array<string>,
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
  intl: IntlShape,
|};

const MAX_SELECTIONS = 4;

const partnerPath = 'viewer.user.group.partners';

function onSelectPartners({
  isSelected,
  selected,
  item,
  push,
  set,
}: {
  isSelected: boolean,
  selected: Array<Object>,
  item: Object,
  push: Function,
  set: Function,
}) {
  if (!isSelected) {
    if (selected.length < MAX_SELECTIONS) push(item);
  } else {
    set(selected.filter((orderItem: Object) => orderItem.id !== item.id));
  }
}

const SelectPartners = ({ intl, cacheKey, partnerTypes, selected, onCancel, onSelect }: Props) => {
  const initialQueryVariables = {
    filter: {
      types: partnerTypes,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    initialQueryVariables,
    cacheKey
  );
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
                      disabled={isEquals(
                        values.map(item => item.id),
                        selected.map(item => item.id)
                      )}
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
                          onSelectPartners({ selected: values, isSelected, item, push, set })
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

const defaultProps = {
  cacheKey: 'SelectPartners',
};

SelectPartners.defaultProps = defaultProps;

export default injectIntl(SelectPartners);
