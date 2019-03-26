// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { TASK_CREATE, TASK_UPDATE } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import TemplateFormContainer from 'modules/taskTemplate/form/container';
import validator from 'modules/taskTemplate/form/validator';
import { FormField } from 'modules/form';
import { TextInputFactory, TextAreaInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { TableTemplateSectionWrapperStyle, DescriptionLabelWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission(TASK_CREATE) || hasPermission(TASK_UPDATE);
  return (
    <div className={TableTemplateSectionWrapperStyle}>
      <GridColumn>
        <Subscribe to={[TemplateFormContainer]}>
          {({ originalValues, state, setFieldValue }) => {
            const values = { ...originalValues, ...state };

            return (
              <>
                <FormField
                  name="name"
                  initValue={values.name}
                  validator={validator}
                  values={values}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) => (
                    <TextInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage id="modules.TaskTemplates.name" defaultMessage="NAME" />
                      }
                      required
                      editable={canCreateOrUpdate}
                    />
                  )}
                </FormField>

                <FormField
                  validator={validator}
                  values={values}
                  name="memo"
                  initValue={values.memo}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) => (
                    <TextAreaInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <div className={DescriptionLabelWrapperStyle}>
                          <FormattedMessage
                            id="modules.TaskTemplates.memo"
                            defaultMessage="DESCRIPTION"
                          />
                        </div>
                      }
                      editable={canCreateOrUpdate}
                      vertical={false}
                      inputWidth="200px"
                      inputHeight="100px"
                      inputAlign="right"
                    />
                  )}
                </FormField>
              </>
            );
          }}
        </Subscribe>
      </GridColumn>
    </div>
  );
};
export default TableTemplateSection;
