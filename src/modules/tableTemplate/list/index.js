// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { useQuery } from '@apollo/react-hooks';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import loadMore from 'utils/loadMore';
import { tableTemplateQuery, allCustomFieldDefinitionsQuery } from './query';

type Props = {
  filterBy: {
    type: string,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const TableTemplateList = ({ ...filtersAndSort }: Props) => {
  const isTableTemplate = window.location.href.includes('templates');

  const {
    data: customFields,
    loading: customFieldsQueryIsLoading,
    error: customFieldsQueryError,
  } = useQuery(allCustomFieldDefinitionsQuery, { fetchPolicy: 'network-only' });

  const {
    data: tableTemplatesData,
    loading: tableTemplatesIsLoading,
    error: tableTemplatesQueryError,
    fetchMore,
    refetch,
  } = useQuery(tableTemplateQuery, {
    fetchPolicy: 'network-only',
    variables: { page: 1, ...filtersAndSort },
  });

  if (customFieldsQueryError || tableTemplatesQueryError) {
    if (
      (customFieldsQueryError?.message ?? '').includes('403') ||
      (tableTemplatesQueryError?.message ?? '').includes('403')
    ) {
      navigate('/403');
    }

    if (customFieldsQueryError) {
      return customFieldsQueryError.message;
    }
    return tableTemplatesQueryError.message;
  }

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
                    (currentCount, column) => (currentCount + column?.hidden ? 0 : 1),
                    0
                  ),
                }}
                type="EDIT_TABLE"
                showActionsOnHover
              />
              <SlideView
                isOpen={isOpen}
                onRequestClose={() => toggle(false)}
                shouldConfirm={() => {
                  const button = document.getElementById('table_template_form_save_button');
                  return button;
                }}
              >
                <TableTemplateFormContainer.Provider
                  initialState={{ ...tableTemplate, customFields }}
                >
                  <TableTemplateFormWrapper
                    isNew={false}
                    onCancel={() => toggle(false)}
                    onRefetch={() => {
                      if (isTableTemplate) {
                        refetch(tableTemplateQuery);
                      }
                    }}
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
