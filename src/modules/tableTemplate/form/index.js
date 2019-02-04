// @flow
import React, { memo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import { TemplateSection, SelectFieldsSection } from './components';
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

function TableTemplateForm({ template, isNew, initDetailValues }: Props) {
  useEffect(() => {
    if (!isNew) {
      initDetailValues(template);
    }
    return null;
  });
  return (
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="tableTemplate_templateSection">
        <SectionHeader
          icon="TEMPLATE"
          title={
            <FormattedMessage id="modules.TableTemplates.template" defaultMessage="TEMPLATE" />
          }
        >
          {!isNew && (
            <>
              <LastModified updatedAt={template.updatedAt} updatedBy={template.updatedBy} />
            </>
          )}
        </SectionHeader>
        <TemplateSection isNew={isNew} />
      </SectionWrapper>
      <SectionWrapper id="tableTemplate_editFieldsSection">
        <SectionHeader
          icon="METADATA"
          title={
            <FormattedMessage id="modules.TableTemplates.editFields" defaultMessage="EDIT FIELDS" />
          }
        />
        <SelectFieldsSection isNew={isNew} />
      </SectionWrapper>
    </div>
  );
}

TableTemplateForm.defaultProps = defaultProps;

// $FlowFixMe: Missing type annotation.
export default memo(TableTemplateForm);
