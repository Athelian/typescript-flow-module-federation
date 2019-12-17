// @flow
import React, { memo } from 'react';
import { SectionWrapper } from 'components/Form';
import TemplateSection from './components/TemplateSection';
import ColumnsConfigSection from './components/ColumnsConfigSection';
import { TemplateFormWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateForm = ({ isNew }: Props) => (
  <div className={TemplateFormWrapperStyle}>
    <SectionWrapper id="tableTemplate_templateSection">
      <TemplateSection isNew={isNew} />
    </SectionWrapper>

    <SectionWrapper id="tableTemplate_editFieldsSection">
      <ColumnsConfigSection />
    </SectionWrapper>
  </div>
);

export default memo<Props>(TableTemplateForm);
