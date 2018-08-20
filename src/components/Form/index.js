import {
  Form as ZenForm,
  Field as ZenField,
  FieldObserver as ZenFieldObserver,
  FieldArray as ZenFieldArray,
} from 'zenform';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import DropDown from './SimpleDropDown';
import TagsInput from './TagsInput';
import InputGroup from './InputGroup';

export const Form = ZenForm;
export const Field = ZenField;
export const FieldObserver = ZenFieldObserver;
export const FieldArray = ZenFieldArray;

export { NumberInput, TextInput, DropDown, TagsInput, InputGroup };
