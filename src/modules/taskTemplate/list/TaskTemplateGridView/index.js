// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import TaskTemplateFormWrapper from 'modules/taskTemplate/common/TaskTemplateFormWrapper';
import { TASK_TEMPLATE_FORM } from 'modules/permission/constants/task';

type OptionalProps = {
  renderItem?: Function,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = (item: Object, hasPermission: Function) => (
  <BooleanValue key={`wrapper-${item.id}`}>
    {({ value: isOpen, set: toggleTaskTemplateForm }) => (
      <React.Fragment key={item.id}>
        <TemplateCard
          type="TASK"
          template={{
            id: item.id,
            title: item.name,
            description: item.description,
            count: item.tasks.length,
          }}
          onClick={() =>
            hasPermission([TASK_TEMPLATE_FORM]) ? toggleTaskTemplateForm(true) : null
          }
        />
        <SlideView isOpen={isOpen} onRequestClose={() => toggleTaskTemplateForm(false)}>
          {isOpen && <TaskTemplateFormWrapper template={item} />}
        </SlideView>
      </React.Fragment>
    )}
  </BooleanValue>
);

const TaskTemplateGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
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
      {items.map(item => renderItem(item, hasPermission))}
    </GridView>
  );
};

export default TaskTemplateGridView;
