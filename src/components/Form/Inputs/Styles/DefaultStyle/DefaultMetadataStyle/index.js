// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormField } from 'modules/form';
import { Label } from 'components/Form';
import { TextInput, DefaultStyle } from 'components/Form/Inputs';

import {
  AdjustmentWrapperStyle,
  AdjustmentFieldsWrapperStyle,
  DragBarStyle,
  EditHandleStyle,
  RemoveButtonStyle,
} from './style';

type OptionalProps = {
  isKeyReadOnly: boolean,
  onRemove?: Function,
};

type Props = OptionalProps & {
  metadata: {
    key: string,
    value: string,
  },
  targetName: string,
  setFieldArrayValue: Function,
  dragHandleProps?: any,
  width: string,
};

const defaultProps = {
  isKeyReadOnly: true,
};

const DefaultMetadataStyle = ({
  isKeyReadOnly,
  metadata,
  dragHandleProps,
  targetName,
  setFieldArrayValue,
  onRemove,
  width,
}: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      {!isKeyReadOnly ? (
        <>
          <div className={DragBarStyle} {...dragHandleProps}>
            <Icon icon="DRAG_HANDLE" />
          </div>
          <FormField
            name={`${targetName}.key`}
            initValue={metadata.key}
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
        </>
      ) : (
        <>
          <div className={EditHandleStyle}>
            <Icon icon="METADATA" />
          </div>

          <Label>{metadata.key}</Label>
        </>
      )}

      <FormField
        name={`${targetName}.value`}
        initValue={metadata.value}
        setFieldValue={setFieldArrayValue}
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

      {onRemove && (
        <button className={RemoveButtonStyle} onClick={onRemove} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  </div>
);

DefaultMetadataStyle.defaultProps = defaultProps;

export default DefaultMetadataStyle;
