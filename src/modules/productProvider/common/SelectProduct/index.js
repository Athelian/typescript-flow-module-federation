// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import GridView from 'components/GridView';
import FilterToolBar from 'components/common/FilterToolBar';
import Layout from 'components/Layout';
import { OrderProductProviderCard } from 'components/Cards';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { productProvidersListQuery } from 'modules/productProvider/list/query';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import { ItemWrapperStyle } from './style';

type OptionalProps = {
  exporter: string,
  selected?: ?{
    id: string,
    name: string,
  },
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
};

const defaultProps = {
  exporter: '',
  selected: {
    id: '',
    name: '',
  },
};

function SelectProduct({ intl, onCancel, onSelect, exporter, selected }: Props) {
  const sortFields = [
    { title: intl.formatMessage(messages.nameSort), value: 'name' },
    { title: intl.formatMessage(messages.serialSort), value: 'serial' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  return (
    <ObjectValue
      defaultValue={{
        perPage: 20,
        page: 1,
        filter: {
          exporterId: exporter,
          archived: false,
          query: '',
        },
        sort: { field: 'updatedAt', direction: 'DESCENDING' },
      }}
    >
      {({ value: filtersAndSort, set: onChange }) => (
        <Query
          key={JSON.stringify(filtersAndSort)}
          query={productProvidersListQuery}
          variables={{
            page: 1,
            perPage: filtersAndSort.perPage,
            filterBy: filtersAndSort.filter,
            sortBy: { [filtersAndSort.sort.field]: filtersAndSort.sort.direction },
          }}
          fetchPolicy="network-only"
        >
          {({ loading, data, error, fetchMore }) => {
            if (error) {
              return error.message;
            }

            const nextPage = getByPathWithDefault(1, 'productProviders.page', data) + 1;
            const totalPage = getByPathWithDefault(1, 'productProviders.totalPage', data);
            const hasMore = nextPage <= totalPage;

            const items = getByPathWithDefault([], 'productProviders.nodes', data);
            return (
              <ObjectValue defaultValue={selected}>
                {({ value, set }) => (
                  <Layout
                    navBar={
                      <SlideViewNavBar>
                        <FilterToolBar
                          icon="PRODUCT_PROVIDER"
                          sortFields={sortFields}
                          filtersAndSort={filtersAndSort}
                          onChange={onChange}
                        />
                        <CancelButton onClick={onCancel} />
                        <SaveButton
                          disabled={isEquals(value, selected)}
                          onClick={() => onSelect(value)}
                          data-testid="saveButtonOnSelectProductProvider"
                        />
                      </SlideViewNavBar>
                    }
                  >
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, filtersAndSort, 'productProviders')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      itemWidth="195px"
                      isEmpty={items.length === 0}
                      emptyMessage={
                        <FormattedMessage
                          id="modules.Orders.noProductProvidersFound"
                          defaultMessage="No end products found"
                        />
                      }
                    >
                      {items.map(item => (
                        <div key={item.id} className={ItemWrapperStyle}>
                          <OrderProductProviderCard
                            productProvider={item}
                            onSelect={() => set(item)}
                            selectable
                            selected={value && item.id === value.id}
                          />
                        </div>
                      ))}
                    </GridView>
                  </Layout>
                )}
              </ObjectValue>
            );
          }}
        </Query>
      )}
    </ObjectValue>
  );
}

SelectProduct.defaultProps = defaultProps;

export default injectIntl(SelectProduct);
