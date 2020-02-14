// @flow
import React, { memo, useEffect } from 'react';
import type { TaskTemplate } from 'generated/graphql';
import { uuid } from 'utils/id';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import usePermission from 'hooks/usePermission';
import { CloneButton } from 'components/Buttons';
import { TASK_TEMPLATE_CREATE } from 'modules/permission/constants/task';
import TaskSectionInTemplate from 'modules/taskTemplate/common/TaskSectionInTemplate';
import TemplateSection from './components/TemplateSection';
import { TemplateFormWrapperStyle } from './style';

type Props = {|
  initDetailValues: (TaskTemplate, TaskTemplate) => void,
  onClone?: TaskTemplate => void,
  isNew?: boolean,
  isClone?: boolean,
  template?: TaskTemplate,
|};

const generateCloneTemplate = (template: TaskTemplate) => {
  const { id, tasks = [], ...info } = template;

  return {
    ...info,
    id: uuid(),
    isNew: true,
    name: `[cloned] ${template.name}`,
    tasks: tasks.map(({ id: taskId, tags = [], ...task }) => ({
      ...task,
      id: uuid(),
      isNew: true,
      tags: tags.map(({ id: tagId, ...tag }) => ({ isNew: true, id: uuid(), ...tag })),
    })),
  };
};

function TaskTemplateForm({
  template = {},
  isNew = false,
  isClone = false,
  onClone = () => {},
  initDetailValues,
}: Props) {
  const { hasPermission } = usePermission();
  useEffect(() => {
    if (isClone) {
      initDetailValues(generateCloneTemplate(template));
    } else {
      initDetailValues(template, template);
    }
  });

  return (
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="taskTemplate_templateSection">
        <SectionHeader
          icon="TEMPLATE"
          title={<FormattedMessage id="modules.TaskTemplates.template" defaultMessage="TEMPLATE" />}
        >
          {!isNew && <LastModified updatedAt={template.updatedAt} updatedBy={template.updatedBy} />}
          {!isNew && !isClone && hasPermission([TASK_TEMPLATE_CREATE]) && (
            <CloneButton onClick={onClone} />
          )}
        </SectionHeader>
        <TemplateSection isNew={isNew} isClone={isClone} />
      </SectionWrapper>
      <TaskSectionInTemplate />
    </div>
  );
}

export default memo<Props>(TaskTemplateForm);
