// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { TEMPLATE_CREATE, TEMPLATE_UPDATE } from 'modules/permission/constants/template';
import validator from 'modules/tableTemplate/form/validator';
import { FormField } from 'modules/form';
import {
  TextInputFactory,
  TextAreaInputFactory,
  SectionHeader,
  LastModified,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import TableTemplateFormContainer from 'modules/tableTemplate/form/container';
import { TableTemplateSectionWrapperStyle, DescriptionLabelWrapperStyle } from './style';

const TableTemplateSection = () => {
  const { state, originalValues, setFieldValue } = TableTemplateFormContainer.useContainer();

  const hasPermissions = useViewerHasPermissions();
  const canCreateOrUpdate = hasPermissions(TEMPLATE_CREATE) || hasPermissions(TEMPLATE_UPDATE);

  return (
    <>
      <SectionHeader
        icon="TEMPLATE"
        title={<FormattedMessage id="modules.TableTemplates.template" defaultMessage="TEMPLATE" />}
      >
        {!state.isNew && (
          <>
            <LastModified
              updatedAt={state.tableTemplate?.updatedAt}
              updatedBy={state.tableTemplate?.updatedBy}
            />
          </>
        )}
      </SectionHeader>

      <div className={TableTemplateSectionWrapperStyle}>
        <GridColumn>
          <FormField
            name="name"
            initValue={originalValues.name}
            validator={validator}
            values={state.values}
            setFieldValue={setFieldValue}
          >
            {inputHandlers => (
              <TextInputFactory
                {...inputHandlers}
                isNew={state.isNew}
                originalValue={originalValues.name}
                label={<FormattedMessage id="modules.TableTemplates.name" defaultMessage="NAME" />}
                required
                editable={canCreateOrUpdate}
              />
            )}
          </FormField>

          <FormField
            name="memo"
            initValue={originalValues.memo}
            validator={validator}
            values={state.values}
            setFieldValue={setFieldValue}
          >
            {inputHandlers => (
              <TextAreaInputFactory
                {...inputHandlers}
                isNew={state.isNew}
                originalValue={originalValues.memo}
                label={
                  <div className={DescriptionLabelWrapperStyle}>
                    <FormattedMessage
                      id="modules.TableTemplates.memo"
                      defaultMessage="DESCRIPTION"
                    />
                  </div>
                }
                editable={canCreateOrUpdate}
                vertical={false}
                inputWidth="200px"
                inputHeight="100px"
              />
            )}
          </FormField>
        </GridColumn>
      </div>
    </>
  );
};
export default TableTemplateSection;
