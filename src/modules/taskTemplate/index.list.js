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
import usePrevious from 'hooks/usePrevious';
import useFilter from 'hooks/useFilter';
import { TASK_TEMPLATE_CREATE } from 'modules/permission/constants/task';
import TaskTemplateList from './list';
import TaskTemplateFormWrapper from './common/TaskTemplateFormWrapper';

type OptionalProps = {
  entityType: string,
};

type Props = OptionalProps & {};

const getInitFilter = (entityType: string) => {
  const state = {
    filter: {
      entityTypes: [entityType],
    },
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
  const lastEntityType = usePrevious(activeType);

  const { hasPermission } = usePermission();
  const { queryVariables, onChangeFilter } = useFilter(
    getInitFilter(activeType),
    `filterTaskTemplate${activeType}`
  );

  React.useEffect(() => {
    if (lastEntityType !== activeType) {
      onChangeFilter({
        filter: {
          entityTypes: [activeType],
        },
      });
    }
  }, [lastEntityType, activeType, onChangeFilter]);

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
                  onClick={() => navigate('/templates/task-template/order')}
                />
                <TabItem
                  active={activeType === 'Batch'}
                  icon="BATCH"
                  label={<FormattedMessage id="module.TaskTemplate.batch" defaultMessage="BATCH" />}
                  onClick={() => navigate('/templates/task-template/batch')}
                />
                <TabItem
                  active={activeType === 'Shipment'}
                  icon="SHIPMENT"
                  label={
                    <FormattedMessage id="module.TaskTemplate.shipment" defaultMessage="SHIPMENT" />
                  }
                  onClick={() => navigate('/templates/task-template/shipment')}
                />

                <BooleanValue>
                  {({ value: isOpen, set: toggleTaskTemplateForm }) => (
                    <>
                      {hasPermission(TASK_TEMPLATE_CREATE) && (
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
