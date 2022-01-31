// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import {
  Label,
  TextInput,
  SelectInput,
  DefaultStyle,
  DefaultSelect,
  DefaultOptions,
} from 'components/Form';
import {
  DefaultCustomFieldDefinitionWrapperStyle,
  DraggingIconStyle,
  CustomFieldIconStyle,
  RemoveButtonStyle,
} from './style';

type OptionalProps = {
  editable: boolean,
  deletable: boolean,
  isNew: boolean,
  onRemove: Function,
};

type Props = OptionalProps & {
  fieldName: any,
  fieldType: string,
  targetName: string,
  setFieldValue: Function,
  dragHandleProps?: any,
};

const defaultProps = {
  editable: true,
  deletable: true,
  onRemove: () => {},
};

const DefaultCustomFieldDefinitionStyle = ({
  fieldName,
  fieldType,
  dragHandleProps,
  targetName,
  setFieldValue,
  isNew,
  editable,
  deletable,
  onRemove,
}: Props) => {
  return (
    <div className={DefaultCustomFieldDefinitionWrapperStyle}>
      {editable ? (
        <div className={DraggingIconStyle} {...dragHandleProps}>
          <Icon icon="DRAG_HANDLE" />
        </div>
      ) : (
        <div className={CustomFieldIconStyle}>
          <Icon icon="METADATA" />
        </div>
      )}

      {editable ? (
        <FormField name={`${targetName}.name`} initValue={fieldName} setFieldValue={setFieldValue}>
          {({ name, ...inputHandlers }) => {
            const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
            return (
              <DefaultStyle
                width="200px"
                isFocused={isFocused}
                hasError={isTouched && errorMessage}
                type="label"
              >
                <TextInput name={name} {...rest} align="left" />
              </DefaultStyle>
            );
          }}
        </FormField>
      ) : (
        <Label width="200px">{fieldName}</Label>
      )}

      <FormField name={`${targetName}.type`} initValue={fieldType} setFieldValue={setFieldValue}>
        {({ name, ...inputHandlers }) => {
          return (
            <SelectInput
              {...inputHandlers}
              onChange={newFieldType => {
                setFieldValue(name, newFieldType);
              }}
              name={name}
              items={['Text', 'Date']}
              renderSelect={({ ...rest }) => (
                <DefaultSelect required width="200px" height="30px" {...rest} />
              )}
              renderOptions={({ ...rest }) => <DefaultOptions width="200px" {...rest} />}
              itemToString={item => item || ''}
              itemToValue={item => item}
              type="label"
              align="left"
              readOnlyWidth="200px"
              readOnlyHeight="30px"
              readOnly={!isNew || !editable}
            />
          );
        }}
      </FormField>

      {deletable && (
        <button className={RemoveButtonStyle} onClick={onRemove} type="button">
          <Icon icon="REMOVE_ALT" />
        </button>
      )}
    </div>
  );
};

DefaultCustomFieldDefinitionStyle.defaultProps = defaultProps;

export default DefaultCustomFieldDefinitionStyle;
