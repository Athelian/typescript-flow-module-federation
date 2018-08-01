// @flow
import type { Node, ComponentType } from 'react';

declare module 'zenform' {
  declare export type RenderableProps<T> = {
    render?: (props: T) => Node,
    children?: (props: T) => Node,
    component?: ComponentType<*> | string,
  };

  declare type FieldUpdateActions = {
    setFieldValue: (field: string, value: any) => void,
    setMultipleFieldValues: (
      fieldValues: Array<{
        field: string,
        value: any,
      }>
    ) => void,
    setFieldError: (field: string, error: any) => void,
    setMultipleFieldErrors: (
      fieldErrors: Array<{
        field: string,
        error: any,
      }>
    ) => void,
    setFieldTouched: (field: string, isTouched: boolean) => void,
    setMultipleFieldTouched: (
      fieldTouched: Array<{
        field: string,
        isTouched: boolean,
      }>
    ) => void,
    setFieldData: (field: string, data: any) => void,
    setMultipleFieldData: (
      fieldData: Array<{
        field: string,
        data: any,
      }>
    ) => void,
    setActiveField: (field: string) => void,
  };

  declare export type ZenFormContext = {
    values: Object,
    errors: any,
    touched: any,
    data: any,
    activeField: string,
    setZenFormState: (s: any, cb?: () => void) => void,
  } & FieldUpdateActions;

  declare export type FormProps = {
    onSubmit: (value: Object) => void,
    initialValues?: Object,
    validations?: (values: Object) => void | Object | Promise<*>,
    validateOnChange?: boolean,
    validateOnBlur?: boolean,
  } & RenderableProps<*>;

  declare export type FormRenderProps = {
    values: Object,
    handleSubmit: (event?: SyntheticEvent<HTMLFormElement>) => void,
    resetForm: () => void,
    errors: Object,
    touched: Object,
    data: Object,
    activeField: string,
    isDirty: boolean,
    isInvalid: boolean,
    initialValues: Object,
  } & FieldUpdateActions;

  declare export type FieldProps = {
    name: string,
    format?: (value: any) => any,
    parse?: (value: any) => any,
    allowNull?: boolean,
    value?: any,
  } & RenderableProps<*>;

  declare export type CacheFieldProps = {
    name: string,
    value: any,
    error: any,
    data: any,
    isTouched: boolean,
    isActive: boolean,
    setFieldValue: (field: string, value: any) => void,
    setFieldTouched: (field: string, isTouched: boolean) => void,
    setActiveField: (field: string) => void,
    parse: (value: any) => any,
    allowNull: boolean,
    passedValue: any,
  } & RenderableProps<*>;

  declare export type FieldRenderProps = {
    input: {
      name: string,
      value: any,
      checked?: boolean,
      onChange: (SyntheticInputEvent<*>) => void,
      onBlur: (SyntheticFocusEvent<*>) => void,
      onFocus: (SyntheticFocusEvent<*>) => void,
    },
    meta: {
      error: any,
      data: any,
      isActive: boolean,
      isTouched: boolean,
    },
  };

  declare export type FieldArrayProps = {
    name: string,
  } & RenderableProps<*>;

  declare export type AuxFieldArrayProps = {
    name: string,
    values: Object,
    errors: any,
    touched: any,
    data: any,
    setZenFormState: (s: any, cb?: Function) => void,
  } & RenderableProps<*>;

  declare export type FieldArrayRenderProps = {
    fields: {
      name: string,
      arrayValues: any[],
      forEach: (iterator: (name: string, index: number) => void) => void,
      insert: (index: number, value: any) => void,
      map: (iterator: (name: string, index: number) => any) => any[],
      move: (from: number, to: number) => void,
      pop: () => void,
      push: (value: any) => void,
      remove: (index: number) => void,
      replace: (index: number, value: any) => void,
      swap: (indexA: number, indexB: number) => void,
      unshift: (value: any) => number,
    },
  };

  declare export type FieldObserverData = {
    name: string,
    value: any,
    formValues: Object,
    data: any,
    isActive: any,
    isTouched: boolean,
  } & FieldUpdateActions;

  declare export type FieldObserverProps = {
    name: string,
    onChange?: (args: FieldObserverData) => void,
    onBlur?: (args: FieldObserverData) => void,
    onFocus?: (args: FieldObserverData) => void,
  };

  declare export type ObserverProps = {
    name: string,
    formValues: any,
    value: any,
    isTouched: boolean,
    isActive: boolean,
    data: any,
    onChange: (args: FieldObserverData) => void,
    onBlur: (args: FieldObserverData) => void,
    onFocus: (args: FieldObserverData) => void,
  } & FieldUpdateActions;

  declare export type FormObserverData = {
    values: Object,
  } & FieldUpdateActions;

  declare export type FormObserverAuxProps = {
    values: Object,
    onChange: (args: FormObserverData) => void,
  } & FieldUpdateActions;

  declare export type FormObserverProps = {
    onChange?: (args: FormObserverData) => void,
  };

  declare export var Form: ComponentType<FormProps>;
  declare export var Field: ComponentType<FieldProps>;
  declare export var FieldArray: ComponentType<FieldArrayProps>;
  declare export var FieldObserver: ComponentType<FieldObserverProps>;
  declare export var FormObserver: ComponentType<FormObserverProps>;
}
