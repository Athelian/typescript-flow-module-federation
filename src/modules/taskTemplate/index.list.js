// @flow
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';

import TaskTemplateList from './list';

const TaskTemplateListModule = () => {
  const [entityType, setEntityType] = useState('Order');

  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="TASK" color="TEMPLATE" invert />
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
                <NewButton />
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
