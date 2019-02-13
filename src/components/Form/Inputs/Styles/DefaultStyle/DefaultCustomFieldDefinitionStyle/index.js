// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { Label, TextInput, DefaultStyle, Display } from 'components/Form';
import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  DragBarStyle,
  EditHandleStyle,
  RemoveButtonStyle,
} from './style';

type OptionalProps = {
  rearrange: boolean,
  isKeyReadOnly: boolean,
  isValueReadOnly: boolean,
  onRemove?: Function,
  width: string,
  value: Object,
};

type Props = OptionalProps & {
  fieldName: any,
  targetName: string,
  setFieldArrayValue: Function,
  dragHandleProps?: any,
};

const defaultProps = {
  rearrange: false,
  isKeyReadOnly: true,
  isValueReadOnly: false,
  width: '200px',
  value: {},
};

const DefaultCustomFieldDefinitionStyle = ({
  rearrange,
  isKeyReadOnly,
  isValueReadOnly,
  value,
  fieldName,
  dragHandleProps,
  targetName,
  setFieldArrayValue,
  onRemove,
  width,
}: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      {rearrange ? (
        <div className={DragBarStyle} {...dragHandleProps}>
          <Icon icon="DRAG_HANDLE" />
        </div>
      ) : (
        <div className={EditHandleStyle}>
          <Icon icon="METADATA" />
        </div>
      )}
      {isKeyReadOnly ? (
        <Label width={width}>{fieldName}</Label>
      ) : (
        <FormField
          name={`${targetName}.name`}
          initValue={fieldName}
          setFieldValue={setFieldArrayValue}
        >
          {({ name, ...inputHandlers }) => {
            const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
            return (
              <DefaultStyle
                width={width}
                isFocused={isFocused}
                hasError={isTouched && errorMessage}
                type="label"
              >
                <TextInput name={name} {...rest} align="left" />
              </DefaultStyle>
            );
          }}
        </FormField>
      )}
      {isValueReadOnly ? (
        <Display>{value.string}</Display>
      ) : (
        <FormField
          name={`${targetName}.value.string`}
          initValue={value.string}
          setFieldValue={setFieldArrayValue}
        >
          {({ name, ...inputHandlers }) => {
            const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
            return (
              <DefaultStyle
                width={width}
                isFocused={isFocused}
                hasError={isTouched && errorMessage}
              >
                <TextInput name={name} {...rest} />
              </DefaultStyle>
            );
          }}
        </FormField>
      )}

      {onRemove && (
        <button className={RemoveButtonStyle} onClick={onRemove} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  </div>
);

DefaultCustomFieldDefinitionStyle.defaultProps = defaultProps;

export default DefaultCustomFieldDefinitionStyle;
