// @flow
import React, { useState } from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import usePermission from 'hooks/usePermission';
import { TASK_CREATE } from 'modules/permission/constants/task';
import TaskTemplateList from './list';
import TaskTemplateFormWrapper from './common/TaskTemplateFormWrapper';

const TaskTemplateListModule = () => {
  const [entityType, setEntityType] = useState('Order');
  const { hasPermission } = usePermission();
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
                  active={entityType === 'Order'}
                  icon="ORDER"
                  label={<FormattedMessage id="module.TaskTemplate.order" defaultMessage="ORDER" />}
                  onClick={() => setEntityType('Order')}
                />
                <TabItem
                  active={entityType === 'Batch'}
                  icon="BATCH"
                  label={<FormattedMessage id="module.TaskTemplate.batch" defaultMessage="BATCH" />}
                  onClick={() => setEntityType('Batch')}
                />
                <TabItem
                  active={entityType === 'Shipment'}
                  icon="SHIPMENT"
                  label={
                    <FormattedMessage id="module.TaskTemplate.shipment" defaultMessage="SHIPMENT" />
                  }
                  onClick={() => setEntityType('Shipment')}
                />

                <BooleanValue>
                  {({ value: isOpen, set: toggle }) => (
                    <>
                      {hasPermission(TASK_CREATE) && <NewButton onClick={() => toggle(true)} />}
                      <SlideView
                        isOpen={isOpen}
                        onRequestClose={() => toggle(false)}
                        options={{ width: '1030px' }}
                      >
                        {isOpen && (
                          <TaskTemplateFormWrapper
                            template={{}}
                            isNew
                            onCancel={() => toggle(false)}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </NavBar>
            }
          >
            <TaskTemplateList entityType={entityType} />
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

export default TaskTemplateListModule;
