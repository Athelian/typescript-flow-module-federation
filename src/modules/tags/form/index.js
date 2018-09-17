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
import EntityTypesInput from 'components/Form/EntityTypesInput';
import { TagFormWrapperStyle, TagSectionWrapperStyle } from './style';

import { TagContainer, EntityTypeContainer } from './containers';

type Props = {
  isNew?: boolean,
};

const defaultProps = {
  isNew: false,
};

export default function TagForm({ isNew }: Props) {
  return (
    <div className={TagFormWrapperStyle}>
      <SectionWrapper id="tagSection">
        <SectionHeader icon="TAGS" title="TAGS" />

        <div className={TagSectionWrapperStyle}>
          <Subscribe to={[TagContainer]}>
            {({ originalValues: initialValues, state, setFieldValue, validationRules }) => {
              const value = { ...initialValues, ...state };
              return (
                <>
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
                                  <TextInput name={name} placeholder="TAG" {...inputHandlers} />
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
                                  <TextInput
                                    name={name}
                                    placeholder="description"
                                    {...inputHandlers}
                                  />
                                </DefaultStyle>
                              }
                            />
                          )}
                        </FormField>
                        <FormField
                          name="color"
                          initValue={value.color}
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
                              input={
                                <DefaultStyle
                                  isFocused={activeField === name}
                                  hasError={touched[name] && errors[name]}
                                  forceHoverStyle={isNew}
                                  height="40px"
                                  width="40px"
                                >
                                  <ColorInput name={name} {...inputHandlers} />
                                </DefaultStyle>
                              }
                            />
                          )}
                        </FormField>
                      </>
                    )}
                  </Subscribe>
                </>
              );
            }}
          </Subscribe>
          <Subscribe to={[FormContainer, EntityTypeContainer]}>
            {({ setFieldTouched }, { state: { entityTypes }, setFieldValue: changeTags }) => (
              <FieldItem
                label={<Label required>Entity Types</Label>}
                input={
                  <EntityTypesInput
                    editable={isNew}
                    name="entityTypes"
                    values={entityTypes}
                    entityTypes={['Product', 'Order', 'Batch', 'Shipment', 'User']}
                    onChange={(field, val) => {
                      changeTags(field, val);
                      setFieldTouched('entityTypes');
                    }}
                  />
                }
              />
            )}
          </Subscribe>
        </div>
      </SectionWrapper>
    </div>
  );
}

TagForm.defaultProps = defaultProps;
