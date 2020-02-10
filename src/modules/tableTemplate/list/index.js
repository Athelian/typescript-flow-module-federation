// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { isNotFound } from 'utils/data';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import { CardAction } from 'components/Cards/BaseCard';
import loadMore from 'utils/loadMore';
import { TableTemplateFormWrapper } from 'modules/tableTemplate/form';
import DeleteTableTemplateConfirm from './components/DeleteTableTemplateConfirm';

type Props = {
  tableTemplatesData: Object,
  tableTemplatesIsLoading: boolean,
  fetchMore: Function,
  customFieldsQueryIsLoading: boolean,
  customFields: ?Object,
  filterBy: {
    type: string,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
  onRefetch?: () => void,
};

const TableTemplateList = ({
  tableTemplatesData,
  tableTemplatesIsLoading,
  fetchMore,
  customFieldsQueryIsLoading,
  customFields,
  onRefetch = () => {},
  ...filtersAndSort
}: Props) => {
  const nextPage = (tableTemplatesData?.maskEdits?.page ?? 1) + 1;
  const totalPages = tableTemplatesData?.maskEdits?.totalPage ?? 1;
  const hasMore = nextPage <= totalPages;

  const tableTemplates = (tableTemplatesData?.maskEdits?.nodes ?? []).filter(
    template => !isNotFound(template)
  );
  const [selectedItem, setSelectedItem] = React.useState(null);

  return (
    <GridView
      onLoadMore={() =>
        loadMore({ fetchMore, data: tableTemplatesData }, filtersAndSort, 'maskEdits')
      }
      hasMore={hasMore}
      isLoading={customFieldsQueryIsLoading || tableTemplatesIsLoading}
      itemWidth="195px"
      isEmpty={tableTemplates.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No templates found" />
      }
    >
      {tableTemplates.map(tableTemplate => (
        <BooleanValue key={tableTemplate.id}>
          {({ value: isOpen, set: toggle }) => (
            <>
              <DeleteTableTemplateConfirm
                isOpen={selectedItem?.id === tableTemplate.id}
                onCancel={() => setSelectedItem(null)}
                entity={tableTemplate}
                onSuccess={() => {
                  setSelectedItem(null);
                  onRefetch();
                }}
              />
              <TemplateCard
                actions={[
                  <CardAction
                    icon="REMOVE"
                    hoverColor="RED"
                    onClick={() => setSelectedItem(tableTemplate)}
                  />,
                ]}
                onClick={() => toggle(true)}
                showActionsOnHover
                key={tableTemplate.id}
                template={{
                  id: tableTemplate.id,
                  title: tableTemplate?.name,
                  description: tableTemplate?.memo,
                  count: (tableTemplate?.columns ?? []).reduce(
                    (currentCount, column) => currentCount + (column?.hidden ? 0 : 1),
                    0
                  ),
                }}
                type="EDIT_TABLE"
              />
              <SlideView
                isOpen={isOpen}
                onRequestClose={() => toggle(false)}
                shouldConfirm={() => document.getElementById('table_template_form_save_button')}
              >
                <TableTemplateFormWrapper
                  type={tableTemplate.type}
                  customFields={customFields}
                  tableTemplate={tableTemplate}
                  onSave={() => toggle(false)}
                  onCancel={() => toggle(false)}
                />
              </SlideView>
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default TableTemplateList;
