// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import TaskTemplateFormWrapper from 'modules/taskTemplate/common/TaskTemplateFormWrapper';
import { TASK_TEMPLATE_UPDATE } from 'modules/permission/constants/task';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const TaskTemplateGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => {
  const { hasPermission } = usePermission();
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
      }
    >
      {items.map(item => (
        <BooleanValue>
          {({ value: isOpen, set: toggleTaskTemplateForm }) => (
            <>
              <TemplateCard
                key={item.id}
                type="TASK"
                template={{
                  id: item.id,
                  title: item.name,
                  description: item.description,
                  count: item.tasks.length,
                }}
                onClick={() =>
                  hasPermission(TASK_TEMPLATE_UPDATE) ? toggleTaskTemplateForm(true) : null
                }
              />
              <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskTemplateForm(false)}>
                {isOpen && (
                  <TaskTemplateFormWrapper
                    template={item}
                    onCancel={() => toggleTaskTemplateForm(false)}
                  />
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      ))}
    </GridView>
  );
};

export default TaskTemplateGridView;
