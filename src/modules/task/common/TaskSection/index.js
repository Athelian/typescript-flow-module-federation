// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue, ObjectValue } from 'react-values';
import { lowerFirst } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { getByPath } from 'utils/fp';
import { SectionNavBar } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader, DashedPlusButton, Label } from 'components/Form';
import { TemplateCard, GrayCard, ProjectCard, MilestoneCard } from 'components/Cards';
import type { TaskCardEditableProps } from 'components/Cards/TaskCard/type.js.flow';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  TASK_FORM,
  TASK_CREATE,
  TASK_UPDATE,
  TASK_DELETE,
  TASK_LIST,
} from 'modules/permission/constants/task';
import { PROJECT_FORM } from 'modules/permission/constants/project';
import {
  ORDER_UPDATE,
  ORDER_TASK_CREATE,
  ORDER_TASK_DELETE,
  ORDER_TASK_UPDATE,
  ORDER_TASK_FORM,
  ORDER_TASK_LIST,
  ORDER_SET_TASKS,
  ORDER_SET_TASK_TEMPLATE,
  ORDER_TASK_SET_NAME,
  ORDER_TASK_SET_DUE_DATE,
  ORDER_TASK_SET_START_DATE,
  ORDER_TASK_SET_IN_PROGRESS,
  ORDER_TASK_SET_SKIPPED,
  ORDER_TASK_SET_COMPLETED,
  ORDER_TASK_SET_APPROVED,
  ORDER_TASK_SET_REJECTED,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_TASK_CREATE,
  ORDER_ITEMS_TASK_DELETE,
  ORDER_ITEMS_TASK_UPDATE,
  ORDER_ITEMS_TASK_FORM,
  ORDER_ITEMS_TASK_LIST,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_SET_TASK_TEMPLATE,
  ORDER_ITEMS_TASK_SET_NAME,
  ORDER_ITEMS_TASK_SET_DUE_DATE,
  ORDER_ITEMS_TASK_SET_START_DATE,
  ORDER_ITEMS_TASK_SET_IN_PROGRESS,
  ORDER_ITEMS_TASK_SET_SKIPPED,
  ORDER_ITEMS_TASK_SET_COMPLETED,
  ORDER_ITEMS_TASK_SET_APPROVED,
  ORDER_ITEMS_TASK_SET_REJECTED,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_UPDATE,
  BATCH_TASK_CREATE,
  BATCH_TASK_DELETE,
  BATCH_TASK_UPDATE,
  BATCH_TASK_FORM,
  BATCH_TASK_LIST,
  BATCH_SET_TASKS,
  BATCH_SET_TASK_TEMPLATE,
  BATCH_TASK_SET_NAME,
  BATCH_TASK_SET_DUE_DATE,
  BATCH_TASK_SET_START_DATE,
  BATCH_TASK_SET_IN_PROGRESS,
  BATCH_TASK_SET_SKIPPED,
  BATCH_TASK_SET_COMPLETED,
  BATCH_TASK_SET_APPROVED,
  BATCH_TASK_SET_REJECTED,
} from 'modules/permission/constants/batch';
import {
  PRODUCT_UPDATE,
  PRODUCT_TASK_CREATE,
  PRODUCT_TASK_DELETE,
  PRODUCT_TASK_UPDATE,
  PRODUCT_TASK_FORM,
  PRODUCT_TASK_LIST,
  PRODUCT_SET_TASKS,
  PRODUCT_SET_TASK_TEMPLATE,
  PRODUCT_TASK_SET_NAME,
  PRODUCT_TASK_SET_DUE_DATE,
  PRODUCT_TASK_SET_START_DATE,
  PRODUCT_TASK_SET_IN_PROGRESS,
  PRODUCT_TASK_SET_SKIPPED,
  PRODUCT_TASK_SET_COMPLETED,
  PRODUCT_TASK_SET_APPROVED,
  PRODUCT_TASK_SET_REJECTED,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_TASK_CREATE,
  PRODUCT_PROVIDER_TASK_DELETE,
  PRODUCT_PROVIDER_TASK_UPDATE,
  PRODUCT_PROVIDER_TASK_FORM,
  PRODUCT_PROVIDER_TASK_LIST,
  PRODUCT_PROVIDER_SET_TASKS,
  PRODUCT_PROVIDER_SET_TASK_TEMPLATE,
  PRODUCT_PROVIDER_TASK_SET_NAME,
  PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
  PRODUCT_PROVIDER_TASK_SET_START_DATE,
  PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
  PRODUCT_PROVIDER_TASK_SET_SKIPPED,
  PRODUCT_PROVIDER_TASK_SET_COMPLETED,
  PRODUCT_PROVIDER_TASK_SET_APPROVED,
  PRODUCT_PROVIDER_TASK_SET_REJECTED,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_TASK_CREATE,
  SHIPMENT_TASK_DELETE,
  SHIPMENT_TASK_UPDATE,
  SHIPMENT_TASK_FORM,
  SHIPMENT_TASK_LIST,
  SHIPMENT_SET_TASKS,
  SHIPMENT_SET_TASK_TEMPLATE,
  SHIPMENT_TASK_SET_NAME,
  SHIPMENT_TASK_SET_DUE_DATE,
  SHIPMENT_TASK_SET_START_DATE,
  SHIPMENT_TASK_SET_IN_PROGRESS,
  SHIPMENT_TASK_SET_SKIPPED,
  SHIPMENT_TASK_SET_COMPLETED,
  SHIPMENT_TASK_SET_APPROVED,
  SHIPMENT_TASK_SET_REJECTED,
} from 'modules/permission/constants/shipment';
import { ProductTasksContainer } from 'modules/product/form/containers';
import { ProductProviderTasksContainer } from 'modules/productProvider/form/containers';
import { OrderTasksContainer } from 'modules/order/form/containers';
import { OrderItemTasksContainer } from 'modules/orderItem/form/containers';
import { BatchTasksContainer } from 'modules/batch/form/containers';
import { ShipmentTasksContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import messages from 'modules/task/messages';
import {
  TasksSectionWrapperStyle,
  TasksSectionBodyStyle,
  TasksSectionStyle,
  TemplateItemStyle,
  TasksSectionProjectAreaStyle,
  TasksSectionTasksAreaStyle,
} from './style';
import Tasks from './components/Tasks';
import SelectTaskTemplate from './components/SelectTaskTemplate';
import ConfirmDialog from './components/ConfirmDialog';

export type CompatibleEntityTypes =
  | 'Batch'
  | 'Order'
  | 'OrderItem'
  | 'Product'
  | 'ProductProvider'
  | 'Shipment';

type Props = {
  type: CompatibleEntityTypes,
  intl: IntlShape,
  entityId: string,
  groupIds: Array<string>,
};

const getConfig = (
  type: string,
  hasPermission: Function
): {
  canViewList: boolean,
  canViewForm: boolean,
  canAddTasks: boolean,
  canDeleteTasks: boolean,
  canOrderingTasks: boolean,
  canUpdateTaskTemplate: boolean,
  tasksContainer: Object,
  editable: TaskCardEditableProps,
} => {
  switch (type) {
    case 'Order':
      return {
        canViewList: hasPermission([ORDER_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([TASK_FORM, ORDER_TASK_FORM]),
        canAddTasks: hasPermission([ORDER_TASK_CREATE, ORDER_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission(ORDER_SET_TASKS),
        canDeleteTasks: hasPermission([ORDER_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([ORDER_UPDATE, ORDER_SET_TASK_TEMPLATE]) &&
          hasPermission([ORDER_UPDATE, ORDER_SET_TASKS]) &&
          hasPermission([ORDER_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([ORDER_TASK_DELETE, TASK_DELETE]),
        tasksContainer: OrderTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_IN_PROGRESS]),
          skipped: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, ORDER_TASK_UPDATE, ORDER_TASK_SET_REJECTED]),
        },
      };
    case 'OrderItem':
      return {
        canViewList: hasPermission([ORDER_ITEMS_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([ORDER_ITEMS_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([ORDER_ITEMS_TASK_CREATE, ORDER_ITEMS_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission(ORDER_ITEMS_SET_TASKS),
        canDeleteTasks: hasPermission([ORDER_ITEMS_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASK_TEMPLATE]) &&
          hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TASKS]) &&
          hasPermission([ORDER_ITEMS_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([ORDER_ITEMS_TASK_DELETE, TASK_DELETE]),
        tasksContainer: OrderItemTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, ORDER_ITEMS_TASK_UPDATE, ORDER_ITEMS_TASK_SET_NAME]),
          startDate: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_START_DATE,
          ]),
          dueDate: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_DUE_DATE,
          ]),
          inProgress: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_SKIPPED,
          ]),
          completed: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_COMPLETED,
          ]),
          approved: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_APPROVED,
          ]),
          rejected: hasPermission([
            TASK_UPDATE,
            ORDER_ITEMS_TASK_UPDATE,
            ORDER_ITEMS_TASK_SET_REJECTED,
          ]),
        },
      };
    case 'Batch':
      return {
        canViewList: hasPermission([BATCH_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([BATCH_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([BATCH_TASK_CREATE, BATCH_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission(BATCH_SET_TASKS),
        canDeleteTasks: hasPermission([BATCH_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([BATCH_UPDATE, BATCH_SET_TASK_TEMPLATE]) &&
          hasPermission([BATCH_UPDATE, BATCH_SET_TASKS]) &&
          hasPermission([BATCH_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([BATCH_TASK_DELETE, TASK_DELETE]),
        tasksContainer: BatchTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_IN_PROGRESS]),
          skipped: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, BATCH_TASK_UPDATE, BATCH_TASK_SET_REJECTED]),
        },
      };
    case 'Product':
      return {
        canViewList: hasPermission([PRODUCT_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([PRODUCT_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([PRODUCT_TASK_CREATE, PRODUCT_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission(PRODUCT_SET_TASKS),
        canDeleteTasks: hasPermission([PRODUCT_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASK_TEMPLATE]) &&
          hasPermission([PRODUCT_UPDATE, PRODUCT_SET_TASKS]) &&
          hasPermission([PRODUCT_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([PRODUCT_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ProductTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_NAME]),
          startDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_START_DATE]),
          dueDate: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([
            TASK_UPDATE,
            PRODUCT_TASK_UPDATE,
            PRODUCT_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_SKIPPED]),
          completed: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_COMPLETED]),
          approved: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, PRODUCT_TASK_UPDATE, PRODUCT_TASK_SET_REJECTED]),
        },
      };
    case 'ProductProvider':
      return {
        canViewList: hasPermission([PRODUCT_PROVIDER_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([PRODUCT_PROVIDER_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([
          PRODUCT_PROVIDER_TASK_CREATE,
          PRODUCT_PROVIDER_SET_TASKS,
          TASK_CREATE,
        ]),
        canOrderingTasks: hasPermission(PRODUCT_PROVIDER_SET_TASKS),
        canDeleteTasks: hasPermission([PRODUCT_PROVIDER_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASK_TEMPLATE]) &&
          hasPermission([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_TASKS]) &&
          hasPermission([PRODUCT_PROVIDER_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([PRODUCT_PROVIDER_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ProductProviderTasksContainer,
        editable: {
          name: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_NAME,
          ]),
          startDate: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_START_DATE,
          ]),
          dueDate: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_DUE_DATE,
          ]),
          inProgress: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_SKIPPED,
          ]),
          completed: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_COMPLETED,
          ]),
          approved: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_APPROVED,
          ]),
          rejected: hasPermission([
            TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_UPDATE,
            PRODUCT_PROVIDER_TASK_SET_REJECTED,
          ]),
        },
      };
    default:
      return {
        canViewList: hasPermission([SHIPMENT_TASK_LIST, TASK_LIST]),
        canViewForm: hasPermission([SHIPMENT_TASK_FORM, TASK_FORM]),
        canAddTasks: hasPermission([SHIPMENT_TASK_CREATE, SHIPMENT_SET_TASKS, TASK_CREATE]),
        canOrderingTasks: hasPermission(SHIPMENT_SET_TASKS),
        canDeleteTasks: hasPermission([SHIPMENT_TASK_DELETE, TASK_DELETE]),
        canUpdateTaskTemplate:
          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASK_TEMPLATE]) &&
          hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TASKS]) &&
          hasPermission([SHIPMENT_TASK_CREATE, TASK_CREATE]) &&
          hasPermission([SHIPMENT_TASK_DELETE, TASK_DELETE]),
        tasksContainer: ShipmentTasksContainer,
        editable: {
          name: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_NAME]),
          startDate: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_START_DATE,
          ]),
          dueDate: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_DUE_DATE]),
          inProgress: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_IN_PROGRESS,
          ]),
          skipped: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_SKIPPED]),
          completed: hasPermission([
            TASK_UPDATE,
            SHIPMENT_TASK_UPDATE,
            SHIPMENT_TASK_SET_COMPLETED,
          ]),
          approved: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_APPROVED]),
          rejected: hasPermission([TASK_UPDATE, SHIPMENT_TASK_UPDATE, SHIPMENT_TASK_SET_REJECTED]),
        },
      };
  }
};

function TaskSection({ type, entityId, intl, groupIds }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canViewProjectForm = hasPermission(PROJECT_FORM);

  const {
    canViewList,
    canViewForm,
    canAddTasks,
    canDeleteTasks,
    canOrderingTasks,
    canUpdateTaskTemplate,
    tasksContainer,
    editable,
  } = getConfig(type, hasPermission);

  if (!canViewList) return null;

  return (
    <Subscribe to={[tasksContainer, FormContainer]}>
      {(
        {
          state: {
            todo: { tasks, taskTemplate, milestone },
          },
          setFieldValue,
          applyTemplate,
        },
        { setFieldTouched }
      ) => (
        <SectionWrapper id={`${lowerFirst(type)}_taskSection`}>
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
                        tags: [],
                        assignedTo: [],
                        approvers: [],
                        approvable: false,
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}
            </SectionNavBar>

            <div className={TasksSectionStyle}>
              <div className={TasksSectionProjectAreaStyle}>
                <ObjectValue
                  defaultValue={{
                    selectedMilestone: milestone,
                    isOpenOfSelector: false,
                    isOpenOfConfirmDialog: false,
                  }}
                >
                  {({
                    value: { selectedMilestone, isOpenOfSelector, isOpenOfConfirmDialog },
                    set,
                  }) => (
                    <>
                      {milestone ? (
                        <div role="presentation" onClick={() => set('isOpenOfSelector', true)}>
                          <Label>
                            <FormattedMessage id="modules.task.project" defaultMessage="PROJECT" />
                          </Label>
                          <ProjectCard project={milestone.project} />
                          <Label>
                            <FormattedMessage
                              id="modules.task.milestone"
                              defaultMessage="MILESTONE"
                            />
                          </Label>
                          <MilestoneCard milestone={milestone} />
                        </div>
                      ) : (
                        <>
                          <Label>
                            <FormattedMessage id="modules.task.project" defaultMessage="PROJECT" />
                          </Label>
                          <DashedPlusButton
                            width="195px"
                            height="458px"
                            onClick={() => set('isOpenOfSelector', true)}
                          />
                        </>
                      )}

                      <SlideView
                        isOpen={isOpenOfSelector}
                        onRequestClose={() => set('isOpenOfSelector', false)}
                      >
                        {isOpenOfSelector && (
                          <SelectProjectAndMilestone
                            filter={{
                              query: '',
                            }}
                            project={getByPath('project', milestone)}
                            milestone={milestone}
                            onSelect={({ milestone: newMilestone, project: newProject }) => {
                              set(
                                'selectedMilestone',
                                newMilestone
                                  ? {
                                      ...newMilestone,
                                      project: newProject,
                                    }
                                  : null
                              );
                              set('isOpenOfConfirmDialog', true);
                            }}
                            onCancel={() => set('isOpenOfSelector', false)}
                          />
                        )}
                      </SlideView>
                      <ConfirmDialog
                        isOpen={isOpenOfConfirmDialog}
                        message={
                          <>
                            <FormattedMessage
                              id="modules.task.setProjectWarningMessage"
                              defaultMessage="Binding this {entityType} to this Project will automatically place any new Tasks into the same Project & Milestone."
                              values={{
                                entityType: type,
                              }}
                            />
                            <br />
                            <FormattedMessage
                              id="modules.task.setProjectConfirmMessage"
                              defaultMessage="Would you like to add all current Tasks to the selected Project & Milestone?"
                            />
                          </>
                        }
                        onRequestClose={() => {}}
                        onCancel={() => {
                          set('isOpenOfConfirmDialog', false);
                        }}
                        onAddNone={() => {
                          setFieldValue('todo.milestone', selectedMilestone);
                          set('isOpenOfConfirmDialog', false);
                          set('isOpenOfSelector', false);
                        }}
                        onAddAllTasks={() => {
                          setFieldValue('todo.milestone', selectedMilestone);
                          setFieldValue(
                            'todo.tasks',
                            tasks.map(task => ({ ...task, milestone: selectedMilestone }))
                          );
                          set('isOpenOfConfirmDialog', false);
                          set('isOpenOfSelector', false);
                        }}
                      />
                    </>
                  )}
                </ObjectValue>
              </div>
              <div className={TasksSectionTasksAreaStyle}>
                <div className={TasksSectionBodyStyle}>
                  {
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          <div className={TemplateItemStyle}>
                            <Label height="30px">
                              {' '}
                              <FormattedMessage
                                id="modules.Tasks.template"
                                defaultMessage="TEMPLATE"
                              />
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
                                entityType={type}
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
                    groupIds={groupIds}
                    entityId={entityId}
                    type={type}
                    editable={editable}
                    navigable={{ project: canViewProjectForm }}
                    sortable={canOrderingTasks}
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
            </div>
          </div>
        </SectionWrapper>
      )}
    </Subscribe>
  );
}

export default injectIntl(TaskSection);
