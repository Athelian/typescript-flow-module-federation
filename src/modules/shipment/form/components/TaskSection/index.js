// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { ShipmentTasksContainer, ShipmentInfoContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import messages from 'modules/shipment/messages';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import ShipmentTasks from './components/ShipmentTasks';

type Props = {
  intl: IntlShape,
};

function TaskSection({ intl }: Props) {
  return (
    <Subscribe to={[ShipmentInfoContainer, ShipmentTasksContainer, FormContainer]}>
      {(
        { state: { no } },
        { state: { tasks }, setFieldValue, setFieldArrayValue },
        { setFieldTouched }
      ) => (
        <SectionWrapper id="shipment_taskSection">
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Shipments.task" defaultMessage="TASK" /> (
                {tasks.length})
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              <div id="sortsandfilterswip" />
              <NewButton
                label={intl.formatMessage(messages.newTask)}
                onClick={() => {
                  setFieldValue('tasks', [
                    ...tasks,
                    injectUid({
                      isNew: true,
                      name: `task - ${tasks.length + 1}`,
                      entity: {
                        __typename: 'Shipment',
                        no,
                      },
                      tags: [],
                    }),
                  ]);
                  setFieldTouched('tasks');
                }}
              />
            </SectionNavBar>
            <div className={TasksSectionBodyStyle}>
              <ShipmentTasks
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

export default injectIntl(TaskSection);
