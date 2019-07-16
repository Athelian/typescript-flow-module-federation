// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { partnersQuery } from 'graphql/partner/query';
import { ObjectValue } from 'react-values';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import FilterToolBar from 'components/common/FilterToolBar';
import { Layout } from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import messages from 'modules/partner/messages';
import { PartnerCard } from 'components/Cards';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {|
  intl: IntlShape,
  partnerTypes: Array<string>,
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
|};

const partnerPath = 'viewer.user.group.partners';

const SelectPartner = ({ intl, cacheKey, partnerTypes, selected, onCancel, onSelect }: Props) => {
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
                  onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, partnerPath)}
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
    </Query>
  );
};

const defaultProps = {
  cacheKey: 'SelectPartner',
};

SelectPartner.defaultProps = defaultProps;

export default injectIntl(SelectPartner);
