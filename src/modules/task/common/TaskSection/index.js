// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { TASK_CREATE, TASK_UPDATE, TASK_DELETE } from 'modules/permission/constants/task';
import { BATCH_TASK_FORM, BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import { BatchTasksContainer } from 'modules/batch/form/containers';
import { ORDER_TASK_FORM, ORDER_TASK_LIST } from 'modules/permission/constants/order';
import { OrderTasksContainer } from 'modules/order/form/containers';
import { SHIPMENT_TASK_FORM, SHIPMENT_TASK_LIST } from 'modules/permission/constants/shipment';
import { ShipmentTasksContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import Tasks from './components/Tasks';

type CompatibleEntityTypes = 'batch' | 'order' | 'shipment' | 'taskTemplate';

type OptionalProps = {
  getConfig: string => Object,
};

type Props = OptionalProps & {
  type: CompatibleEntityTypes,
  intl: IntlShape,
};

const defaultProps = {
  getConfig: (type: string) => {
    if (type === 'batch') {
      return {
        taskListPermission: BATCH_TASK_LIST,
        taskFormPermission: BATCH_TASK_FORM,
        tasksContainer: BatchTasksContainer,
        isInTemplate: false,
      };
    }
    if (type === 'order') {
      return {
        taskListPermission: ORDER_TASK_LIST,
        taskFormPermission: ORDER_TASK_FORM,
        tasksContainer: OrderTasksContainer,
        isInTemplate: false,
      };
    }
    if (type === 'shipment') {
      return {
        taskListPermission: SHIPMENT_TASK_LIST,
        taskFormPermission: SHIPMENT_TASK_FORM,
        tasksContainer: ShipmentTasksContainer,
        isInTemplate: false,
      };
    }
    return { isInTemplate: true };
  },
};

function TaskSection({ getConfig, type, intl }: Props) {
  const { taskListPermission, taskFormPermission, tasksContainer, isInTemplate } = getConfig(type);

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(taskListPermission) && !isInTemplate) return null;

  return (
    <Subscribe to={[tasksContainer, FormContainer]}>
      {(
        {
          state: {
            todo: { tasks },
          },
          setFieldValue,
        },
        { setFieldTouched }
      ) => (
        <SectionWrapper id={`${type}_taskSection`}>
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />
                {' ('}
                <FormattedNumber value={tasks.length} />
                {')'}
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              {(hasPermission(TASK_CREATE) || isInTemplate) && (
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
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              <Tasks
                isInTemplate={isInTemplate}
                type={type}
                editable={hasPermission(TASK_UPDATE) || isInTemplate}
                viewForm={hasPermission(taskFormPermission) || isInTemplate}
                removable={hasPermission(TASK_DELETE) || isInTemplate}
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
                  setFieldTouched(`tasks.${index}`);
                }}
              />
            </div>
          </div>
        </SectionWrapper>
      )}
    </Subscribe>
  );
}

TaskSection.defaultProps = defaultProps;

export default injectIntl(TaskSection);
