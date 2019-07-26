// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { TEMPLATE_CREATE, TEMPLATE_UPDATE } from 'modules/permission/constants/template';
import usePermission from 'hooks/usePermission';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import validator from 'modules/tableTemplate/form/validator';
import { FormField } from 'modules/form';
import { TextInputFactory, TextAreaInputFactory } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { TableTemplateSectionWrapperStyle, DescriptionLabelWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission(TEMPLATE_CREATE) || hasPermission(TEMPLATE_UPDATE);
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
                        <FormattedMessage id="modules.TableTemplates.name" defaultMessage="NAME" />
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
              </>
            );
          }}
        </Subscribe>
      </GridColumn>
    </div>
  );
};
export default TableTemplateSection;
