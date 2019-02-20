// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import validator from 'modules/tableTemplate/form/validator';
import { FormField } from 'modules/form';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { TableTemplateSectionWrapperStyle, DescriptionLabelWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => (
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
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    required: true,
                    originalValue: originalValues[name],
                    label: (
                      <FormattedMessage id="modules.TableTemplates.name" defaultMessage="NAME" />
                    ),
                  })
                }
              </FormField>

              <FormField
                validator={validator}
                values={values}
                name="memo"
                initValue={values.memo}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) =>
                  textAreaFactory({
                    inputHandlers,
                    name,
                    isNew,
                    height: '100px',
                    width: '200px',
                    align: 'right',
                    originalValue: originalValues[name],
                    label: (
                      <div className={DescriptionLabelWrapperStyle}>
                        <FormattedMessage id="modules.TableTemplates.memo" defaultMessage="MEMO" />
                      </div>
                    ),
                  })
                }
              </FormField>
            </>
          );
        }}
      </Subscribe>
    </GridColumn>
  </div>
);

export default TableTemplateSection;
