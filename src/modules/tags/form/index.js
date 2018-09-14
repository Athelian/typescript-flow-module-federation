// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import {
  FieldItem,
  Label,
  Tooltip,
  SectionHeader,
  SectionWrapper,
  DefaultStyle,
  TextInput,
} from 'components/Form';
import { FormContainer, FormField } from 'modules/form';
import { TagFormWrapperStyle, TagSectionWrapperStyle } from './style';

import TagContainer from './containers';

type Props = {
  isNew?: boolean,
};

const defaultProps = {
  isNew: false,
};

export default function TagForm({ isNew }: Props) {
  return (
    <div className={TagFormWrapperStyle}>
      <SectionWrapper id="tagSecion">
        <SectionHeader icon="TAGS" title="TAGS" />
        <Subscribe to={[TagContainer]}>
          {({ originalValues: initialValues, state, setFieldValue, validationRules }) => {
            const values = { ...initialValues, ...state };
            return (
              <div className={TagSectionWrapperStyle}>
                <Subscribe to={[FormContainer]}>
                  {({ state: { touched, errors, activeField }, ...formHelper }) => (
                    <>
                      <FormField
                        name="name"
                        initValue={values.name}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...values, ...newValue }, validationRules())
                        }
                        setFieldValue={setFieldValue}
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={<Label required>NAME</Label>}
                            tooltip={
                              <Tooltip
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
                                width="200px"
                                forceHoverStyle={isNew}
                              >
                                <TextInput name={name} {...inputHandlers} />
                              </DefaultStyle>
                            }
                          />
                        )}
                      </FormField>
                      <FormField
                        name="description"
                        initValue={values.description}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...values, ...newValue }, validationRules())
                        }
                        setFieldValue={setFieldValue}
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={<Label required>DESCRIPTION</Label>}
                            tooltip={
                              <Tooltip
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
                                width="200px"
                                forceHoverStyle={isNew}
                              >
                                <TextInput name={name} {...inputHandlers} />
                              </DefaultStyle>
                            }
                          />
                        )}
                      </FormField>
                      <FormField
                        name="color"
                        initValue={values.color}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...values, ...newValue }, validationRules())
                        }
                        setFieldValue={setFieldValue}
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={<Label required>COLOR</Label>}
                            tooltip={
                              <Tooltip
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
                                width="200px"
                                forceHoverStyle={isNew}
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
              </div>
            );
          }}
        </Subscribe>
      </SectionWrapper>
    </div>
  );
}

TagForm.defaultProps = defaultProps;
