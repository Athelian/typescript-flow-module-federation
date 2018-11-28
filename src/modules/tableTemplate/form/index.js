// @flow
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
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
  });
  return (
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="templateSection">
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
      <SectionWrapper id="editFieldsSection">
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

// $FlowFixMe: flow type is not supported yet
export default memo(TableTemplateForm);
