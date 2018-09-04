// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import BatchFormContainer from 'modules/batch/form/container';
import { FormContainer, FormField } from 'modules/form';
import { FieldItem, InputGroup, Label, Tooltip, DefaultStyle, TextInput } from 'components/Form';
import messages from 'modules/batch/messages';
import { OrderSectionWrapperStyle, MainFieldsWrapperStyle } from './style';

type Props = {
  isNew: boolean,
  initialValues: Object,
};

const BatchSection = ({ isNew, initialValues }: Props) => (
  <div className={OrderSectionWrapperStyle}>
    <Subscribe to={[BatchFormContainer]}>
      {({ state: values, setFieldValue, validationRules }) => (
        <>
          <div className={MainFieldsWrapperStyle}>
            <InputGroup fieldGap={20}>
              <Subscribe to={[FormContainer]}>
                {({ state: { touched, errors, activeField }, ...formHelper }) => (
                  <>
                    <FormField
                      name="no"
                      initValue={values.no}
                      validationOnChange
                      onValidate={newValue =>
                        formHelper.onValidation({ ...values, ...newValue }, validationRules())
                      }
                      setFieldValue={setFieldValue}
                      {...formHelper}
                    >
                      {({ name, ...inputHandlers }) => (
                        <FieldItem
                          label={
                            <Label required>
                              <FormattedMessage {...messages.batchNo} />
                            </Label>
                          }
                          tooltip={
                            <Tooltip
                              isNew={isNew}
                              errorMessage={touched[name] && errors[name]}
                              changedValues={{
                                oldValue: initialValues[name],
                                newValue: values[name],
                              }}
                            />
                          }
                          input={
                            <DefaultStyle
                              isFocused={activeField === name}
                              hasError={touched[name] && errors[name]}
                              forceHoverStyle={isNew}
                              width="200px"
                            >
                              <TextInput name={name} {...inputHandlers} />
                            </DefaultStyle>
                          }
                        />
                      )}
                    </FormField>
                  </>
                )}
              </Subscribe>
            </InputGroup>
          </div>
        </>
      )}
    </Subscribe>
  </div>
);

export default BatchSection;
