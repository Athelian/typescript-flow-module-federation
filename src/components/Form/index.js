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
import FieldItem from './FieldItem';
import Label from './Label';
import Display from './Display';
import {
  StyledDateInput,
  StyledEmailInput,
  StyledNumberInput,
  StyledPasswordInput,
  StyledTextInput,
} from './StyledInputs';
import DashedPlusButton from './DashedPlusButton';

export const Form = ZenForm;
export const Field = ZenField;
export const FieldObserver = ZenFieldObserver;
export const FormObserver = ZenFormObserver;
export const FieldArray = ZenFieldArray;

export {
  FieldItem,
  Label,
  Display,
  StyledDateInput,
  StyledEmailInput,
  StyledNumberInput,
  StyledPasswordInput,
  StyledTextInput,
  DashedPlusButton,
  NumberInput,
  TextInput,
  DropDown,
  TagsInput,
  InputGroup,
};
