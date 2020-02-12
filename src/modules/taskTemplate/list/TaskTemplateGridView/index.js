// @flow
import * as React from 'react';
import type { TaskTemplate } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard, CardAction } from 'components/Cards';
import TaskTemplateFormWrapper from 'modules/taskTemplate/common/TaskTemplateFormWrapper';
import { TASK_TEMPLATE_FORM, TASK_TEMPLATE_CREATE } from 'modules/permission/constants/task';

type Props = {|
  items: Array<TaskTemplate>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  RenderItem?: React.ComponentType<any>,
|};

const DefaultRenderer = ({ template }: { template: TaskTemplate }) => {
  const { hasPermission } = usePermission();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClone, setIsClone] = React.useState(false);
  const onClose = () => {
    setIsOpen(false);
    setIsClone(false);
  };
  const onClone = () => {
    setIsOpen(true);
    setIsClone(true);
  };
  return (
    <>
      <TemplateCard
        type="TASK"
        template={{
          id: template.id,
          title: template.name,
          description: template.description,
          count: template.tasks.length,
        }}
        showActionsOnHover
        actions={[
          ...(hasPermission(TASK_TEMPLATE_CREATE)
            ? [<CardAction icon="CLONE" onClick={onClone} />]
            : []),
        ]}
        onClick={() => (hasPermission([TASK_TEMPLATE_FORM]) ? setIsOpen(true) : null)}
      />
      <SlideView
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldConfirm={() => {
          const button = document.getElementById('task_template_form_save_button');
          return button;
        }}
      >
        {isOpen && (
          <TaskTemplateFormWrapper
            template={template}
            isClone={isClone}
            onCancel={onClose}
            onClone={() => {
              onClose();
              setTimeout(() => {
                onClone();
              }, 200);
            }}
          />
        )}
      </SlideView>
    </>
  );
};

const TaskTemplateGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  RenderItem = DefaultRenderer,
}: Props) => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
      }
    >
      {items.map(template => (
        <RenderItem template={template} key={template?.id} />
      ))}
    </GridView>
  );
};

export default TaskTemplateGridView;
