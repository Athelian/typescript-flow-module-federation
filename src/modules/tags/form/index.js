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
import Tag from 'components/Tag';
import { FormContainer, FormField } from 'modules/form';
import ColorInput from 'components/Form/ColorInput';
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
            const value = { ...initialValues, ...state };
            return (
              <div className={TagSectionWrapperStyle}>
                <Tag tag={value} />
                <Subscribe to={[FormContainer]}>
                  {({ state: { touched, errors, activeField }, ...formHelper }) => (
                    <>
                      <FormField
                        name="name"
                        initValue={value.name}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...value, ...newValue }, validationRules())
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
                                  newValue: value[name],
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
                        initValue={value.description}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...value, ...newValue }, validationRules())
                        }
                        setFieldValue={setFieldValue}
                        {...formHelper}
                      >
                        {({ name, ...inputHandlers }) => (
                          <FieldItem
                            label={<Label>DESCRIPTION</Label>}
                            tooltip={
                              <Tooltip
                                errorMessage={touched[name] && errors[name]}
                                changedValues={{
                                  oldValue: initialValues[name],
                                  newValue: value[name],
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
                        initValue={value.color || '#ffffff'}
                        validationOnChange
                        onValidate={newValue =>
                          formHelper.onValidation({ ...value, ...newValue }, validationRules())
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
                                  newValue: value[name],
                                }}
                              />
                            }
                            input={<ColorInput name={name} {...inputHandlers} />}
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
