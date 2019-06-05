// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { upperFirst } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader, DashedPlusButton, Label } from 'components/Form';
import { TemplateCard, GrayCard } from 'components/Cards';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { TASK_CREATE, TASK_UPDATE, TASK_DELETE } from 'modules/permission/constants/task';
import {
  ORDER_TASK_CREATE,
  ORDER_TASK_FORM,
  ORDER_TASK_LIST,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_TASK_LIST,
  ORDER_ITEMS_TASK_FORM,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_SET_TASK_TEMPLATE,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_TASK_FORM,
  BATCH_TASK_LIST,
  BATCH_UPDATE,
  BATCH_SET_TASKS,
  BATCH_SET_TASK_TEMPLATE,
} from 'modules/permission/constants/batch';
import {
  SHIPMENT_TASK_FORM,
  SHIPMENT_TASK_LIST,
  SHIPMENT_UPDATE,
  SHIPMENT_SET_TASK_TEMPLATE,
  SHIPMENT_SET_TASKS,
} from 'modules/permission/constants/shipment';
import {
  PRODUCT_TASK_FORM,
  PRODUCT_TASK_LIST,
  PRODUCT_UPDATE,
  PRODUCT_SET_TASKS,
  PRODUCT_SET_TASK_TEMPLATE,
  PRODUCT_PROVIDER_TASK_FORM,
  PRODUCT_PROVIDER_TASK_LIST,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_TASKS,
  PRODUCT_PROVIDER_SET_TASK_TEMPLATE,
} from 'modules/permission/constants/product';
import { ProductTasksContainer } from 'modules/product/form/containers';
import { ProductProviderTasksContainer } from 'modules/productProvider/form/containers';
import { OrderTasksContainer } from 'modules/order/form/containers';
import { OrderItemTasksContainer } from 'modules/orderItem/form/containers';
import { BatchTasksContainer } from 'modules/batch/form/containers';
import { ShipmentTasksContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle, TemplateItemStyle } from './style';
import Tasks from './components/Tasks';
import SelectTaskTemplate from './components/SelectTaskTemplate';

export type CompatibleEntityTypes =
  | 'batch'
  | 'order'
  | 'orderItem'
  | 'product'
  | 'productProvider'
  | 'shipment';

type Props = {
  type: CompatibleEntityTypes,
  intl: IntlShape,
  entityId: string,
};

const getConfig = (type: string, hasPermission: Function): Object => {
  switch (type) {
    case 'order':
      return {
        canViewList: hasPermission(ORDER_TASK_LIST),
        canViewForm: hasPermission(ORDER_TASK_FORM),
        canAddTasks: hasPermission([ORDER_TASK_CREATE, TASK_CREATE]),
        canDeleteTasks: hasPermission(TASK_DELETE) && hasPermission(ORDER_UPDATE),
        canUpdateTasks: hasPermission(TASK_UPDATE) && hasPermission(ORDER_UPDATE),
        canUpdateTaskTemplate:
          hasPermission(TASK_CREATE) && hasPermission(TASK_DELETE) && hasPermission(ORDER_UPDATE),
        tasksContainer: OrderTasksContainer,
      };
    case 'orderItem': {
      const allowSetTasks = hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASKS]);
      return {
        canViewList: hasPermission(ORDER_ITEMS_TASK_LIST),
        canViewForm: hasPermission(ORDER_ITEMS_TASK_FORM),
        canAddTasks: hasPermission(TASK_CREATE) && allowSetTasks,
        canDeleteTasks: hasPermission(TASK_DELETE) && allowSetTasks,
        canUpdateTasks: hasPermission(TASK_UPDATE) && allowSetTasks,
        canUpdateTaskTemplate:
          (hasPermission(TASK_CREATE) &&
            hasPermission(TASK_DELETE) &&
            hasPermission(ORDER_ITEMS_UPDATE)) ||
          (hasPermission(ORDER_ITEMS_SET_TASK_TEMPLATE) && hasPermission(ORDER_ITEMS_SET_TASKS)),
        tasksContainer: OrderItemTasksContainer,
      };
    }
    case 'batch':
      return {
        canViewList: hasPermission(BATCH_TASK_LIST),
        canViewForm: hasPermission(BATCH_TASK_FORM),
        canAddTasks: hasPermission(TASK_CREATE) && hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]),
        canDeleteTasks:
          hasPermission(TASK_DELETE) && hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]),
        canUpdateTasks:
          hasPermission(TASK_UPDATE) && hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]),
        canUpdateTaskTemplate:
          hasPermission(TASK_CREATE) &&
          hasPermission(TASK_DELETE) &&
          (hasPermission(BATCH_UPDATE) ||
            (hasPermission(BATCH_SET_TASK_TEMPLATE) && hasPermission(BATCH_SET_TASKS))),
        tasksContainer: BatchTasksContainer,
      };
    case 'product':
      return {
        canViewList: hasPermission(PRODUCT_TASK_LIST),
        canViewForm: hasPermission(PRODUCT_TASK_FORM),
        canAddTasks:
          hasPermission(TASK_CREATE) && hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]),
        canDeleteTasks:
          hasPermission(TASK_DELETE) && hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]),
        canUpdateTasks:
          hasPermission(TASK_UPDATE) && hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]),
        canUpdateTaskTemplate:
          hasPermission(TASK_CREATE) &&
          hasPermission(TASK_DELETE) &&
          (hasPermission(PRODUCT_UPDATE) ||
            (hasPermission(PRODUCT_SET_TASK_TEMPLATE) && hasPermission(PRODUCT_SET_TASKS))),
        tasksContainer: ProductTasksContainer,
      };
    case 'productProvider':
      return {
        canViewList: hasPermission(PRODUCT_PROVIDER_TASK_LIST),
        canViewForm: hasPermission(PRODUCT_PROVIDER_TASK_FORM),
        canAddTasks:
          hasPermission(TASK_CREATE) &&
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]),
        canDeleteTasks:
          hasPermission(TASK_DELETE) &&
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]),
        canUpdateTasks:
          hasPermission(TASK_UPDATE) &&
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]),
        canUpdateTaskTemplate:
          hasPermission(TASK_CREATE) &&
          hasPermission(TASK_DELETE) &&
          (hasPermission(PRODUCT_PROVIDER_UPDATE) ||
            (hasPermission(PRODUCT_PROVIDER_SET_TASK_TEMPLATE) &&
              hasPermission(PRODUCT_PROVIDER_SET_TASKS))),
        tasksContainer: ProductProviderTasksContainer,
      };
    default:
      return {
        canViewList: hasPermission(SHIPMENT_TASK_LIST),
        canViewForm: hasPermission(SHIPMENT_TASK_FORM),
        canAddTasks:
          hasPermission(TASK_CREATE) && hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]),
        canDeleteTasks:
          hasPermission(TASK_DELETE) && hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]),
        canUpdateTasks:
          hasPermission(TASK_UPDATE) && hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]),
        canUpdateTaskTemplate:
          hasPermission(TASK_CREATE) &&
          hasPermission(TASK_DELETE) &&
          (hasPermission(SHIPMENT_UPDATE) ||
            (hasPermission(SHIPMENT_SET_TASK_TEMPLATE) && hasPermission(SHIPMENT_SET_TASKS))),
        tasksContainer: ShipmentTasksContainer,
      };
  }
};

function TaskSection({ type, entityId, intl }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const {
    canViewList,
    canViewForm,
    canAddTasks,
    canDeleteTasks,
    canUpdateTasks,
    canUpdateTaskTemplate,
    tasksContainer,
  } = getConfig(type, hasPermission);

  if (!canViewList) return null;

  return (
    <Subscribe to={[tasksContainer, FormContainer]}>
      {(
        {
          state: {
            todo: { tasks, taskTemplate },
          },
          setFieldValue,
          applyTemplate,
        },
        { setFieldTouched }
      ) => (
        <SectionWrapper id={`${type}_taskSection`}>
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Tasks.tasks" defaultMessage="TASKS" />
                {' ('}
                <FormattedNumber value={tasks.length} />
                {')'}
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              {canAddTasks && (
                <NewButton
                  label={intl.formatMessage(messages.newTask)}
                  onClick={() => {
                    setFieldValue('todo.tasks', [
                      ...tasks,
                      injectUid({
                        isNew: true,
                        name: `task - ${tasks.length + 1}`,
                        assignedTo: [],
                        tags: [],
                        approvers: [],
                        approvable: false,
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              {
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      <div className={TemplateItemStyle}>
                        <Label height="24px">
                          {' '}
                          <FormattedMessage id="modules.Tasks.template" defaultMessage="TEMPLATE" />
                        </Label>
                        {taskTemplate ? (
                          <TemplateCard
                            type="TASK"
                            template={{
                              id: taskTemplate.id,
                              title: taskTemplate.name,
                              description: taskTemplate.description,
                              count: taskTemplate.tasks && taskTemplate.tasks.length,
                            }}
                            onClick={() => {
                              if (canUpdateTaskTemplate) {
                                slideToggle(true);
                              }
                            }}
                            readOnly={!canUpdateTaskTemplate}
                          />
                        ) : (
                          <>
                            {canUpdateTaskTemplate ? (
                              <DashedPlusButton
                                width="195px"
                                height="125px"
                                onClick={() => slideToggle(true)}
                              />
                            ) : (
                              <GrayCard width="195px" height="125px" />
                            )}
                          </>
                        )}
                      </div>

                      <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                        {opened && (
                          <SelectTaskTemplate
                            entityType={upperFirst(type)}
                            onCancel={() => slideToggle(false)}
                            onSelect={newValue => {
                              slideToggle(false);
                              applyTemplate(newValue);
                            }}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              }
              <Tasks
                entityId={entityId}
                type={type}
                editable={canUpdateTasks}
                viewForm={canViewForm}
                removable={canDeleteTasks}
                tasks={tasks}
                onSwap={(index: number, direction: 'left' | 'right') => {
                  const nextIndex = direction === 'left' ? index - 1 : index + 1;

                  if (nextIndex > -1 && nextIndex < tasks.length) {
                    const clonedTasks = [...tasks];
                    clonedTasks[nextIndex] = { ...tasks[index] };
                    clonedTasks[index] = { ...tasks[nextIndex] };
                    setFieldValue('todo.tasks', clonedTasks);
                    setFieldTouched(`tasks.${index}`);
                    setFieldTouched(`tasks.${nextIndex}`);
                  }
                }}
                onRemove={({ id }) => {
                  setFieldValue('todo.tasks', tasks.filter(({ id: itemId }) => id !== itemId));
                  setFieldTouched(`tasks.${id}`);
                }}
                onSave={(index, newValue) => {
                  setFieldValue(`todo.tasks.${index}`, newValue);
                }}
              />
            </div>
          </div>
        </SectionWrapper>
      )}
    </Subscribe>
  );
}

export default injectIntl(TaskSection);
