// @flow
import React, { memo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import TemplateSection from './components/TemplateSection';
import TaskSection from './components/TaskSection';
import { TemplateFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  template: Object,
};

type Props = OptionalProps & {
  initDetailValues: Object => void,
};

const defaultProps = {
  isNew: false,
  template: {},
};

function TaskTemplateForm({ template, isNew, initDetailValues }: Props) {
  useEffect(() => {
    if (!isNew) {
      initDetailValues(template);
    }
  });
  return (
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="taskTemplate_templateSection">
        <SectionHeader
          icon="TEMPLATE"
          title={<FormattedMessage id="modules.TaskTemplates.template" defaultMessage="TEMPLATE" />}
        >
          {!isNew && (
            <>
              <LastModified updatedAt={template.updatedAt} updatedBy={template.updatedBy} />
            </>
          )}
        </SectionHeader>
        <TemplateSection isNew={isNew} />
      </SectionWrapper>
      <SectionWrapper id="taskTemplate_taskSection">
        <SectionHeader
          icon="EDIT_Task"
          title={<FormattedMessage id="modules.TaskTemplates.task" defaultMessage="TASK" />}
        />
        <TaskSection isNew={isNew} />
      </SectionWrapper>
    </div>
  );
}

TaskTemplateForm.defaultProps = defaultProps;

export default memo<Props>(TaskTemplateForm);
