// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { SlideViewLayout } from 'components/Layout';
import { tableTemplateQuery } from 'modules/tableTemplate/list/query';
import TableTemplateGridView from 'modules/tableTemplate/list/TableTemplateGridView';
import { SaveButton, CancelButton } from 'components/Buttons';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { TemplateCard } from 'components/Cards';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectTemplate = ({ selected, onCancel, onSelect }: Props) => (
  <Query
    query={tableTemplateQuery}
    variables={{
      page: 1,
      perPage: 10,
      filterBy: {
        type: 'Order',
      },
      sortBy: {
        updatedAt: 'DESCENDING',
      },
    }}
    fetchPolicy="network-only"
  >
    {({ error, loading, data, fetchMore }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, `maskEdits.page`, data) + 1;
      const totalPage = getByPathWithDefault(1, `maskEdits.totalPage`, data);
      const hasMore = nextPage <= totalPage;
      return (
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                <CancelButton onClick={onCancel} />
                <SaveButton
                  disabled={isEquals(value, selected)}
                  onClick={() => onSelect(value)}
                  data-testid="saveButtonOnSelectTemplate"
                />
              </SlideViewNavBar>
              <TableTemplateGridView
                items={getByPathWithDefault([], 'maskEdits.nodes', data)}
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'maskEdits')}
                hasMore={hasMore}
                isLoading={loading}
                renderItem={item => (
                  <TemplateCard
                    onSelect={() => set(item)}
                    key={item.id}
                    template={{
                      id: item.id,
                      title: item.name,
                      description: item.memo,
                      count: (item.fields || []).length,
                    }}
                    type="EDIT_TABLE"
                    actions={[]}
                    showActionsOnHover
                    selectable
                    selected={value && value.id === item.id}
                  />
                )}
              />
            </SlideViewLayout>
          )}
        </ObjectValue>
      );
    }}
  </Query>
);

SelectTemplate.defaultProps = defaultProps;

export default SelectTemplate;
