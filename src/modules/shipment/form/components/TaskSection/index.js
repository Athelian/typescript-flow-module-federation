// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { ShipmentTasksContainer } from 'modules/shipment/form/containers';
import { FormContainer } from 'modules/form';
import { TasksSectionWrapperStyle, TasksSectionBodyStyle } from './style';
import ShipmentTasks from './components/ShipmentTasks';

function TaskSection() {
  return (
    <SectionWrapper id="shipment_taskSection">
      <SectionHeader
        icon="TASK"
        title={<FormattedMessage id="modules.Shipments.task" defaultMessage="TASK" />}
      />
      <div className={TasksSectionWrapperStyle}>
        <div className={TasksSectionBodyStyle}>
          <Subscribe to={[ShipmentTasksContainer, FormContainer]}>
            {({ state: { tasks }, setFieldValue, setFieldArrayValue }, { setFieldTouched }) => (
              <ShipmentTasks
                tasks={tasks}
                onRemove={({ id }) => {
                  setFieldValue('tasks', tasks.filter(({ id: itemId }) => id !== itemId));
                  setFieldTouched(`tasks.${id}`);
                }}
                onSave={(index, newValue) => {
                  setFieldArrayValue(index, newValue);
                  setFieldTouched(`tasks.${index}`);
                }}
              />
            )}
          </Subscribe>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default TaskSection;
