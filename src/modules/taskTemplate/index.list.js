// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import withCache from 'hoc/withCache';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import { TASK_TEMPLATE_CREATE } from 'modules/permission/constants/task';
import TaskTemplateList from './list';
import TaskTemplateFormWrapper from './common/TaskTemplateFormWrapper';

const initFilter = {
  filter: {
    entityTypes: ['Order'],
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
};

const TaskTemplateListModule = () => {
  const { hasPermission } = usePermission();
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    initFilter,
    `filterTaskTemplate`
  );
  const activeType = filterAndSort.filter.entityTypes[0];

  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                <TabItem
                  active={activeType === 'Order'}
                  icon="ORDER"
                  label={<FormattedMessage id="module.TaskTemplate.order" defaultMessage="ORDER" />}
                  onClick={() => {
                    if (activeType !== 'Order') {
                      onChangeFilter({
                        ...filterAndSort,
                        filter: { ...filterAndSort.filter, entityTypes: ['Order'] },
                      });
                    }
                  }}
                />
                <TabItem
                  active={activeType === 'Batch'}
                  icon="BATCH"
                  label={<FormattedMessage id="module.TaskTemplate.batch" defaultMessage="BATCH" />}
                  onClick={() => {
                    if (activeType !== 'Batch') {
                      onChangeFilter({
                        ...filterAndSort,
                        filter: { ...filterAndSort.filter, entityTypes: ['Batch'] },
                      });
                    }
                  }}
                />
                <TabItem
                  active={activeType === 'Shipment'}
                  icon="SHIPMENT"
                  label={
                    <FormattedMessage id="module.TaskTemplate.shipment" defaultMessage="SHIPMENT" />
                  }
                  onClick={() => {
                    if (activeType !== 'Shipment') {
                      onChangeFilter({
                        ...filterAndSort,
                        filter: { ...filterAndSort.filter, entityTypes: ['Shipment'] },
                      });
                    }
                  }}
                />

                <BooleanValue>
                  {({ value: isOpen, set: toggleTaskTemplateForm }) => (
                    <>
                      {hasPermission(TASK_TEMPLATE_CREATE) && (
                        <NewButton onClick={() => toggleTaskTemplateForm(true)} />
                      )}
                      <SlideView
                        isOpen={isOpen}
                        onRequestClose={() => toggleTaskTemplateForm(false)}
                      >
                        {isOpen && (
                          <TaskTemplateFormWrapper
                            template={{
                              entityType: activeType,
                            }}
                            isNew
                            onCancel={() => toggleTaskTemplateForm(false)}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </NavBar>
            }
          >
            <TaskTemplateList queryVariables={queryVariables} entityType={activeType} />
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

export default withCache(TaskTemplateListModule, ['entityType']);
