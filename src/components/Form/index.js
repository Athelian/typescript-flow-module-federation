import {
  Form as ZenForm,
  Field as ZenField,
  FieldObserver as ZenFieldObserver,
  FormObserver as ZenFormObserver,
  FieldArray as ZenFieldArray,
} from 'zenform';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import DropDown from './SimpleDropDown';
import TagsInput from './TagsInput';
import InputGroup from './InputGroup';
import { FormTextInput } from './FormInputs';

export const Form = ZenForm;
export const Field = ZenField;
export const FieldObserver = ZenFieldObserver;
export const FormObserver = ZenFormObserver;
export const FieldArray = ZenFieldArray;

export { FormTextInput, NumberInput, TextInput, DropDown, TagsInput, InputGroup };
