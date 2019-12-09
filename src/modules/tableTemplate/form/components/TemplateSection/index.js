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

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => {
  const { state, originalState, setFieldValue } = TableTemplateFormContainer.useContainer();

  const hasPermissions = useViewerHasPermissions();
  const canCreateOrUpdate = hasPermissions(TEMPLATE_CREATE) || hasPermissions(TEMPLATE_UPDATE);

  return (
    <>
      <SectionHeader
        icon="TEMPLATE"
        title={<FormattedMessage id="modules.TableTemplates.template" defaultMessage="TEMPLATE" />}
      >
        {!isNew && (
          <>
            <LastModified updatedAt={state.updatedAt} updatedBy={state.updatedBy} />
          </>
        )}
      </SectionHeader>

      <div className={TableTemplateSectionWrapperStyle}>
        <GridColumn>
          <FormField
            name="name"
            initValue={originalState.name}
            validator={validator}
            values={state}
            setFieldValue={setFieldValue}
          >
            {inputHandlers => (
              <TextInputFactory
                {...inputHandlers}
                isNew={isNew}
                originalValue={originalState.name}
                label={<FormattedMessage id="modules.TableTemplates.name" defaultMessage="NAME" />}
                required
                editable={canCreateOrUpdate}
              />
            )}
          </FormField>

          <FormField
            name="memo"
            initValue={originalState.memo}
            validator={validator}
            values={state}
            setFieldValue={setFieldValue}
          >
            {inputHandlers => (
              <TextAreaInputFactory
                {...inputHandlers}
                isNew={isNew}
                originalValue={originalState.memo}
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
