// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import loadMore from 'utils/loadMore';

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
};

const TableTemplateList = ({
  tableTemplatesData,
  tableTemplatesIsLoading,
  fetchMore,
  customFieldsQueryIsLoading,
  customFields,
  ...filtersAndSort
}: Props) => {
  const nextPage = (tableTemplatesData?.maskEdits?.page ?? 1) + 1;
  const totalPages = tableTemplatesData?.maskEdits?.totalPage ?? 1;
  const hasMore = nextPage <= totalPages;

  const tableTemplates = tableTemplatesData?.maskEdits?.nodes ?? [];

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
              <TemplateCard
                onClick={() => toggle(true)}
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
                <TableTemplateFormContainer.Provider
                  initialState={{ ...tableTemplate, customFields }}
                >
                  <TableTemplateFormWrapper
                    isNew={false}
                    onSave={() => toggle(false)}
                    onCancel={() => toggle(false)}
                  />
                </TableTemplateFormContainer.Provider>
              </SlideView>
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default TableTemplateList;
