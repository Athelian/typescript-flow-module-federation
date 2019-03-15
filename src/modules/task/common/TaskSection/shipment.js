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
import { SHIPMENT_TASK_FORM, SHIPMENT_TASK_LIST } from 'modules/permission/constants/shipment';
import { ShipmentTasksContainer, ShipmentInfoContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import Tasks from './components/Tasks';

type Props = {
  intl: IntlShape,
};

function ShipmentTaskSection({ intl }: Props) {
  const type = 'Shipment';
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(SHIPMENT_TASK_LIST)) return null;

  return (
    <Subscribe to={[ShipmentInfoContainer, ShipmentTasksContainer, FormContainer]}>
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
                        isNew: true,
                        name: `task - ${tasks.length + 1}`,
                        entity: {
                          __typename: type,
                          no,
                        },
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
                type={type}
                editable={hasPermission(TASK_UPDATE)}
                viewForm={hasPermission(SHIPMENT_TASK_FORM)}
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

export default injectIntl(ShipmentTaskSection);
