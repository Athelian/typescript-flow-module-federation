// @flow
import * as React from 'react';
import useQueryList from 'hooks/useQueryList';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { tableTemplateQuery } from 'modules/tableTemplate/list/query';
import TableTemplateGridView from 'modules/tableTemplate/list/TableTemplateGridView';
import { SaveButton, CancelButton } from 'components/Buttons';
import { EntityIcon } from 'components/NavBar';
import { TemplateCard } from 'components/Cards';
import Selector from 'components/Selector';

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

const SelectTemplate = ({ selected, onCancel, onSelect }: Props) => {
  const { nodes, loading, hasMore, loadMore } = useQueryList(
    tableTemplateQuery,
    {
      variables: {
        page: 1,
        perPage: 10,
        filterBy: {
          type: 'Order',
        },
        sortBy: {
          updatedAt: 'DESCENDING',
        },
      },
      fetchPolicy: 'network-only',
    },
    'maskEdits'
  );

  return (
    <Selector.Single selected={selected}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
            <CancelButton onClick={onCancel} />
            <SaveButton
              disabled={!dirty}
              onClick={() => onSelect(value)}
              data-testid="saveButtonOnSelectTemplate"
            />
          </SlideViewNavBar>

          <Content>
            <TableTemplateGridView
              items={nodes}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={item => (
                <TemplateCard
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
                  {...getItemProps(item)}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

SelectTemplate.defaultProps = defaultProps;

export default SelectTemplate;
