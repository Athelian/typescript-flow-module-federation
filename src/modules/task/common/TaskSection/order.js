// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import { OrderTasksContainer, OrderInfoContainer } from 'modules/order/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import Tasks from './components/Tasks';

type Props = {
  intl: IntlShape,
};

function OrderTaskSection({ intl }: Props) {
  const type = 'Order';
  return (
    <Subscribe to={[OrderInfoContainer, OrderTasksContainer, FormContainer]}>
      {(
        { state: { poNo } },
        { state: { tasks }, setFieldValue, setFieldArrayValue },
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
              <NewButton
                label={intl.formatMessage(messages.newTask)}
                onClick={() => {
                  setFieldValue('tasks', [
                    ...tasks,
                    injectUid({
                      isNew: true,
                      name: `task - ${tasks.length + 1}`,
                      entity: {
                        __typename: type,
                        poNo,
                      },
                      tags: [],
                    }),
                  ]);
                  setFieldTouched('tasks');
                }}
              />
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              <Tasks
                checkPermission={ORDER_UPDATE}
                tasks={tasks}
                onRemove={({ id }) => {
                  setFieldValue('tasks', tasks.filter(({ id: itemId }) => id !== itemId));
                  setFieldTouched(`tasks.${id}`);
                }}
                onSave={(index, newValue) => {
                  setFieldArrayValue(`tasks.${index}`, newValue);
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

export default injectIntl(OrderTaskSection);
