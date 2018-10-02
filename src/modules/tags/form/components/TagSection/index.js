// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { TagContainer, EntityTypeContainer } from 'modules/tags/form/containers';
import validator from 'modules/tags/form/validator';
import { FormField } from 'modules/form';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import {
  ColorInput,
  DefaultStyle,
  TextInput,
  FieldItem,
  Label,
  Tooltip,
  RadioInput,
} from 'components/Form';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import GridColumn from 'components/GridColumn';
import {
  TagSectionWrapperStyle,
  DescriptionLabelWrapperStyle,
  ColorInputWrapperStyle,
  ColorInputButtonStyle,
  EntityTypesWrapperStyle,
  EntityTypeStyle,
  EntityIconStyle,
} from './style';

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
              <FieldItem label={<Label>PREVIEW</Label>} input={<Tag tag={values} />} />

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
                    align: 'right',
                    originalValue: originalValues[name],
                    label: <div className={DescriptionLabelWrapperStyle}>DESCRIPTION</div>,
                  })
                }
              </FormField>

              <FormField
                name="color"
                initValue={values.color}
                validator={validator}
                setFieldValue={setFieldValue}
              >
                {({ name, isTouched, errorMessage, isFocused, ...inputHandlers }) => (
                  <FieldItem
                    label={<Label required>COLOR</Label>}
                    tooltip={
                      <Tooltip
                        isNew={isNew}
                        errorMessage={isTouched && errorMessage}
                        changedValues={{
                          oldValue: originalValues[name],
                          newValue: inputHandlers.value,
                        }}
                      />
                    }
                    input={
                      <div className={ColorInputWrapperStyle}>
                        <DefaultStyle
                          isFocused={isFocused}
                          hasError={isTouched && errorMessage}
                          forceHoverStyle={isNew}
                          width="200px"
                        >
                          <TextInput name={name} {...inputHandlers} />
                        </DefaultStyle>
                        <div className={ColorInputButtonStyle}>
                          <ColorInput name={name} {...inputHandlers} />
                        </div>
                      </div>
                    }
                  />
                )}
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
              {({ name, isTouched, errorMessage, onChange, ...inputHandlers }) => (
                <FieldItem
                  vertical
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
                    <div className={EntityTypesWrapperStyle}>
                      <RadioInput
                        selected={values.entityTypes.includes('Order')}
                        onToggle={() => toggleSelectType('Order')}
                      >
                        <div className={EntityTypeStyle}>
                          <div className={EntityIconStyle('ORDER')}>
                            <Icon icon="ORDER" />
                          </div>
                          <Label>ORDER</Label>
                        </div>
                      </RadioInput>
                      <RadioInput
                        selected={values.entityTypes.includes('Batch')}
                        onToggle={() => toggleSelectType('Batch')}
                      >
                        <div className={EntityTypeStyle}>
                          <div className={EntityIconStyle('BATCH')}>
                            <Icon icon="BATCH" />
                          </div>
                          <Label>BATCH</Label>
                        </div>
                      </RadioInput>

                      <RadioInput
                        selected={values.entityTypes.includes('Shipment')}
                        onToggle={() => toggleSelectType('Shipment')}
                      >
                        <div className={EntityTypeStyle}>
                          <div className={EntityIconStyle('SHIPMENT')}>
                            <Icon icon="SHIPMENT" />
                          </div>
                          <Label>SHIPMENT</Label>
                        </div>
                      </RadioInput>
                      <RadioInput
                        selected={values.entityTypes.includes('Product')}
                        onToggle={() => toggleSelectType('Product')}
                      >
                        <div className={EntityTypeStyle}>
                          <div className={EntityIconStyle('PRODUCT')}>
                            <Icon icon="PRODUCT" />
                          </div>
                          <Label>PRODUCT</Label>
                        </div>
                      </RadioInput>

                      <RadioInput
                        selected={values.entityTypes.includes('User')}
                        onToggle={() => toggleSelectType('User')}
                      >
                        <div className={EntityTypeStyle}>
                          <div className={EntityIconStyle('STAFF')}>
                            <Icon icon="STAFF" />
                          </div>
                          <Label>STAFF</Label>
                        </div>
                      </RadioInput>
                    </div>
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
