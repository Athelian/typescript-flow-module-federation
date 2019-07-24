// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { partnersQuery } from 'graphql/partner/query';
import { ArrayValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import FilterToolBar from 'components/common/FilterToolBar';
import { Content, SlideViewLayout } from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import messages from 'modules/partner/messages';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {|
  intl: IntlShape,
  partnerTypes: Array<string>,
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
|};

const MAX_SELECTIONS = 4;

const partnerPath = 'viewer.user.group.partners';

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
    <Query fetchPolicy="network-only" query={partnersQuery} variables={queryVariables}>
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
            {({ value: values, push, filter }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <FilterToolBar
                    icon="PARTNER"
                    sortFields={sortFields}
                    filtersAndSort={filterAndSort}
                    onChange={onChangeFilter}
                    canSearch
                  />
                  <h3>
                    {values.length}/{MAX_SELECTIONS}
                  </h3>
                  <CancelButton disabled={false} onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(values.map(item => item.id), selected.map(item => item.id))}
                    onClick={() => onSelect(values)}
                  />
                </SlideViewNavBar>

                <Content>
                  <PartnerGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, filterAndSort, partnerPath)}
                    items={items}
                    renderItem={item => {
                      const isSelected = values.map(({ id }) => id).includes(item.id);
                      return (
                        <PartnerCard
                          key={item.id}
                          selectable
                          selected={isSelected}
                          partner={item}
                          onSelect={() => {
                            if (isSelected) {
                              filter(({ id }) => id !== item.id);
                            } else if (values.length < MAX_SELECTIONS) {
                              push(item);
                            }
                          }}
                        />
                      );
                    }}
                  />
                </Content>
              </SlideViewLayout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
};

const defaultProps = {
  cacheKey: 'SelectPartners',
};

SelectPartners.defaultProps = defaultProps;

export default injectIntl(SelectPartners);
