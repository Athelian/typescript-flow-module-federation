// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { useQuery } from '@apollo/react-hooks';
import { Provider } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage, useIntl } from 'react-intl';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { TEMPLATE_CREATE } from 'modules/permission/constants/template';
import SlideView from 'components/SlideView';
import TableTemplateFormWrapper from 'modules/tableTemplate/common/TableTemplateFormWrapper';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import useFilter from 'hooks/useFilter';
import { allCustomFieldDefinitionsQuery, tableTemplateQuery } from './list/query';
import TableTemplateList from './list';
import messages from './messages';

const getInitFilter = (type: string) => ({
  viewType: 'grid',
  filter: {
    type,
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
});

const TableTemplateModule = () => {
  const intl = useIntl();
  const isTableTemplate = window.location.href.includes('templates');

  const hasPermissions = useViewerHasPermissions();

  const {
    data: customFields,
    loading: customFieldsQueryIsLoading,
    error: customFieldsQueryError,
  } = useQuery(allCustomFieldDefinitionsQuery, { fetchPolicy: 'network-only' });

  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter('OrderSheet'),
    'filterTableTemplate'
  );

  const {
    data: tableTemplatesData,
    loading: tableTemplatesIsLoading,
    error: tableTemplatesQueryError,
    fetchMore,
    refetch,
  } = useQuery(tableTemplateQuery, {
    fetchPolicy: 'network-only',
    variables: { page: 1, ...queryVariables },
  });

  if (customFieldsQueryError) {
    if ((customFieldsQueryError?.message ?? '').includes('403')) {
      navigate('/403');
    }

    return customFieldsQueryError.message;
  }

  if (tableTemplatesQueryError) {
    if ((tableTemplatesQueryError?.message ?? '').includes('403')) {
      navigate('/403');
    }

    return tableTemplatesQueryError.message;
  }

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const canCreate = hasPermissions(TEMPLATE_CREATE);
  const activeType = filtersAndSort.filter?.type;
  const setActiveType = (type: string) => onChangeFilter({ ...filtersAndSort, filter: { type } });

  return (
    <Provider>
      <Content>
        <NavBar>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
          <TabItem
            active={activeType === 'OrderSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.orderSheet"
                defaultMessage="Order Table"
              />
            }
            icon="ORDER"
            onClick={() => {
              if (activeType !== 'OrderSheet') {
                setActiveType('OrderSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'BatchSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.batchSheet"
                defaultMessage="Batch Table"
              />
            }
            icon="BATCH"
            onClick={() => {
              if (activeType !== 'BatchSheet') {
                setActiveType('BatchSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'ShipmentSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.shipmentSheet"
                defaultMessage="Shipment Table"
              />
            }
            icon="SHIPMENT"
            onClick={() => {
              if (activeType !== 'ShipmentSheet') {
                setActiveType('ShipmentSheet');
              }
            }}
          />
          <TabItem
            active={activeType === 'ProjectSheet'}
            label={
              <FormattedMessage
                id="modules.TableTemplates.projectSheet"
                defaultMessage="Project Table"
              />
            }
            icon="PROJECT"
            onClick={() => {
              if (activeType !== 'ProjectSheet') {
                setActiveType('ProjectSheet');
              }
            }}
          />

          <FilterToolBar
            sortFields={sortFields}
            filtersAndSort={filtersAndSort}
            onChange={onChangeFilter}
            canSearch
          />

          {canCreate && (
            <BooleanValue>
              {({ value: isOpen, set: toggle }) => (
                <>
                  <NewButton onClick={() => toggle(true)} isLoading={customFieldsQueryIsLoading} />
                  <SlideView
                    isOpen={isOpen}
                    onRequestClose={() => toggle(false)}
                    shouldConfirm={() => document.getElementById('table_template_form_save_button')}
                  >
                    <TableTemplateFormContainer.Provider
                      initialState={{ type: activeType, customFields }}
                    >
                      <TableTemplateFormWrapper
                        isNew
                        onSave={() => toggle(false)}
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
          )}
        </NavBar>
        <TableTemplateList
          isTableTemplate={isTableTemplate}
          tableTemplatesData={tableTemplatesData}
          tableTemplatesIsLoading={tableTemplatesIsLoading}
          fetchMore={fetchMore}
          customFieldsQueryIsLoading={customFieldsQueryIsLoading}
          customFields={customFields}
          {...queryVariables}
        />
      </Content>
    </Provider>
  );
};

export default TableTemplateModule;
