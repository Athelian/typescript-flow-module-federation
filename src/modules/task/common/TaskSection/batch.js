// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { TASK_CREATE, TASK_UPDATE, TASK_DELETE } from 'modules/permission/constants/task';
import { BATCH_TASK_FORM, BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import { BatchTasksContainer, BatchInfoContainer } from 'modules/batch/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import Tasks from './components/Tasks';

type Props = {
  intl: IntlShape,
};

function BatchTaskSection({ intl }: Props) {
  const type = 'Batch';
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(BATCH_TASK_LIST)) return null;

  return (
    <Subscribe to={[BatchInfoContainer, BatchTasksContainer, FormContainer]}>
      {(
        { state: { no } },
        {
          state: {
            todo: { tasks },
          },
          setFieldValue,
        },
        { setFieldTouched }
      ) => (
        <SectionWrapper id={`${type.toLowerCase()}_taskSection`}>
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" /> ({tasks.length})
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              {hasPermission(TASK_CREATE) && (
                <NewButton
                  label={intl.formatMessage(messages.newTask)}
                  onClick={() => {
                    setFieldValue('todo.tasks', [
                      ...tasks,
                      injectUid({
                        name: `task - ${tasks.length + 1}`,
                        entity: {
                          __typename: type,
                          no,
                        },
                        assignedTo: [],
                        tags: [],
                        memo: '',
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              <Tasks
                type={type}
                editable={hasPermission(TASK_UPDATE)}
                viewForm={hasPermission(BATCH_TASK_FORM)}
                removable={hasPermission(TASK_DELETE)}
                tasks={tasks}
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

export default injectIntl(BatchTaskSection);
