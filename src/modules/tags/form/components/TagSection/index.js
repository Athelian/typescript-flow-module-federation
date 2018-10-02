// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { TagContainer, EntityTypeContainer } from 'modules/tags/form/containers';
import validator from 'modules/tags/form/validator';
import { FormField } from 'modules/form';
import Tag from 'components/Tag';
import { ColorInput, FieldItem, Label, Tooltip } from 'components/Form';
import EntityTypesInput from 'modules/tags/components/EntityTypesInput';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import { TagSectionWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TagSection = ({ isNew }: Props) => (
  <div className={TagSectionWrapperStyle}>
    <GridColumn>
      <Subscribe to={[TagContainer]}>
        {({ originalValues, state, setFieldValue }) => {
          // $FlowFixMe
          const values = { ...originalValues, ...state };

          return (
            <>
              <Tag tag={values} />

              <FormField
                name="name"
                initValue={values.name}
                validator={validator}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    required: true,
                    originalValue: originalValues[name],
                    label: 'NAME',
                  })
                }
              </FormField>

              <FormField
                name="description"
                initValue={values.description}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) =>
                  textAreaFactory({
                    inputHandlers,
                    name,
                    isNew,
                    height: '100px',
                    width: '200px',
                    originalValue: originalValues[name],
                    label: 'DESCRIPTION',
                  })
                }
              </FormField>

              <FormField
                name="color"
                initValue={values.color}
                validator={validator}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) =>
                  textInputFactory({
                    inputHandlers,
                    name,
                    isNew,
                    required: true,
                    originalValue: originalValues[name],
                    label: 'COLOR',
                    InputComponent: ColorInput,
                  })
                }
              </FormField>
            </>
          );
        }}
      </Subscribe>
      <Subscribe to={[EntityTypeContainer]}>
        {({ originalValues, state, toggleSelectType }) => {
          // $FlowFixMe
          const values = { ...originalValues, ...state };

          return (
            <FormField
              name="entityTypes"
              initValue={values.entityTypes}
              setFieldValue={(field, newValue) => toggleSelectType(newValue)}
            >
              {({ name, isTouched, errorMessage, ...inputHandlers }) => (
                <FieldItem
                  label={<Label required>TYPES</Label>}
                  tooltip={
                    <Tooltip
                      isNew={isNew}
                      errorMessage={isTouched && errorMessage}
                      changedValues={{
                        oldValue: originalValues.entityTypes.sort().join(','),
                        newValue: inputHandlers.value.sort().join(','),
                      }}
                    />
                  }
                  input={
                    <EntityTypesInput
                      values={inputHandlers.value}
                      name={name}
                      onChange={toggleSelectType}
                    />
                  }
                />
              )}
            </FormField>
          );
        }}
      </Subscribe>
    </GridColumn>
  </div>
);

export default TagSection;
