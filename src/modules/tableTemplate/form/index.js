// @flow
import React, { memo } from 'react';
import { SectionWrapper } from 'components/Form';
import { TemplateSection, ColumnsConfigSection } from './components';
import { TemplateFormWrapperStyle } from './style';

type Props = {
  isNew: ?boolean,
};

function TableTemplateForm({ isNew }: Props) {
  return (
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="tableTemplate_templateSection">
        <TemplateSection isNew={isNew} />
      </SectionWrapper>

      <SectionWrapper id="tableTemplate_editFieldsSection">
        <ColumnsConfigSection />
      </SectionWrapper>
    </div>
  );
}

export default memo<Props>(TableTemplateForm);
