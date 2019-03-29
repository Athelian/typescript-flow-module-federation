// @flow
import * as React from 'react';
import { upperFirst } from 'lodash';
import { BooleanValue } from 'react-values';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import withCache from 'hoc/withCache';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import { TASK_CREATE } from 'modules/permission/constants/task';
import TaskTemplateList from './list';
import TaskTemplateFormWrapper from './common/TaskTemplateFormWrapper';

type OptionalProps = {
  entityType: string,
};

type Props = OptionalProps & {};

const getInitFilter = () => {
  const state = {
    filter: {},
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

const defaultProps = {
  entityType: 'order',
};

const TaskTemplateListModule = ({ entityType }: Props) => {
  const activeType = upperFirst(entityType);
  const { hasPermission } = usePermission();
  const { queryVariables } = useFilter(getInitFilter(), `filterTaskTemplate${activeType}`);
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
                  active={activeType === 'Order'}
                  icon="ORDER"
                  label={<FormattedMessage id="module.TaskTemplate.order" defaultMessage="ORDER" />}
                  onClick={() => navigate('/settings/task-template/order')}
                />
                <TabItem
                  active={activeType === 'Batch'}
                  icon="BATCH"
                  label={<FormattedMessage id="module.TaskTemplate.batch" defaultMessage="BATCH" />}
                  onClick={() => navigate('/settings/task-template/batch')}
                />
                <TabItem
                  active={activeType === 'Shipment'}
                  icon="SHIPMENT"
                  label={
                    <FormattedMessage id="module.TaskTemplate.shipment" defaultMessage="SHIPMENT" />
                  }
                  onClick={() => navigate('/settings/task-template/shipment')}
                />

                <BooleanValue>
                  {({ value: isOpen, set: toggleTaskTemplateForm }) => (
                    <>
                      {hasPermission(TASK_CREATE) && (
                        <NewButton onClick={() => toggleTaskTemplateForm(true)} />
                      )}
                      <SlideView
                        isOpen={isOpen}
                        onRequestClose={() => toggleTaskTemplateForm(false)}
                      >
                        {isOpen && (
                          <TaskTemplateFormWrapper
                            template={{
                              entityType: activeType,
                            }}
                            isNew
                            onCancel={() => toggleTaskTemplateForm(false)}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              </NavBar>
            }
          >
            <TaskTemplateList {...queryVariables} entityType={activeType} />
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

TaskTemplateListModule.defaultProps = defaultProps;

export default withCache(TaskTemplateListModule, ['entityType']);
