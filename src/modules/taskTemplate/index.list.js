// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import withCache from 'hoc/withCache';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import { getByPathWithDefault } from 'utils/fp';
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
  const canCreate = hasPermission(TASK_TEMPLATE_CREATE);
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    initFilter,
    'filterTaskTemplate'
  );
  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  return (
    <Provider>
      <Content>
        <NavBar>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" subIcon="TASK" />
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
            active={activeType === 'OrderItem'}
            icon="ORDER_ITEM"
            label={<FormattedMessage id="module.TaskTemplate.orderItem" defaultMessage="ITEM" />}
            onClick={() => {
              if (activeType !== 'OrderItem') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['OrderItem'] },
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
            label={<FormattedMessage id="module.TaskTemplate.shipment" defaultMessage="SHIPMENT" />}
            onClick={() => {
              if (activeType !== 'Shipment') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['Shipment'] },
                });
              }
            }}
          />
          <TabItem
            active={activeType === 'Product'}
            icon="PRODUCT"
            label={<FormattedMessage id="module.TaskTemplate.product" defaultMessage="PRODUCT" />}
            onClick={() => {
              if (activeType !== 'Product') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['Product'] },
                });
              }
            }}
          />
          <TabItem
            active={activeType === 'ProductProvider'}
            icon="PRODUCT_PROVIDER"
            label={
              <FormattedMessage id="module.TaskTemplate.endProduct" defaultMessage="END PRODUCT" />
            }
            onClick={() => {
              if (activeType !== 'ProductProvider') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['ProductProvider'] },
                });
              }
            }}
          />

          {canCreate && (
            <BooleanValue>
              {({ value: isOpen, set: toggleTaskTemplateForm }) => (
                <>
                  <NewButton onClick={() => toggleTaskTemplateForm(true)} />
                  <SlideView
                    isOpen={isOpen}
                    onRequestClose={() => toggleTaskTemplateForm(false)}
                    shouldConfirm={() => {
                      return document.getElementById('task_template_form_save_button');
                    }}
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
          )}
        </NavBar>
        <TaskTemplateList queryVariables={queryVariables} entityType={activeType} />
      </Content>
    </Provider>
  );
};

export default withCache(TaskTemplateListModule, ['entityType']);
