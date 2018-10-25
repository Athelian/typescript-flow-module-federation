// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { TextInput, DefaultStyle } from 'components/Form/Inputs';

import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  DragBarStyle,
  RemoveButtonStyle,
} from './style';

type Props = {
  metadata: {
    label: string,
    value: string,
  },
  targetName: string,
  index: number,
  setFieldArrayValue: Function,
  dragHandleProps?: any,
  onRemove: Function,
  width: string,
};

const DefaultMetadataStyle = ({
  metadata,
  dragHandleProps,
  targetName,
  index,
  setFieldArrayValue,
  onRemove,
  width,
}: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      <div className={DragBarStyle} {...dragHandleProps}>
        <Icon icon="DRAG_HANDLE" />
      </div>

      <FormField
        name={`${targetName}.${index}.label`}
        initValue={metadata.label}
        setFieldValue={setFieldArrayValue}
        saveOnChange
      >
        {({ name, ...inputHandlers }) => {
          const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
          return (
            <DefaultStyle width={width} isFocused={isFocused} hasError={isTouched && errorMessage}>
              <TextInput name={name} {...rest} />
            </DefaultStyle>
          );
        }}
      </FormField>

      <FormField
        name={`${targetName}.${index}.value`}
        initValue={metadata.value}
        setFieldValue={setFieldArrayValue}
        saveOnChange
      >
        {({ name, ...inputHandlers }) => {
          const { isFocused, isTouched, errorMessage, ...rest } = inputHandlers;
          return (
            <DefaultStyle width={width} isFocused={isFocused} hasError={isTouched && errorMessage}>
              <TextInput name={name} {...rest} />
            </DefaultStyle>
          );
        }}
      </FormField>

      <button className={RemoveButtonStyle} onClick={onRemove} type="button">
        <Icon icon="REMOVE" />
      </button>
    </div>
  </div>
);

export default DefaultMetadataStyle;
