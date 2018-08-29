import {
  Form as ZenForm,
  Field as ZenField,
  FieldObserver as ZenFieldObserver,
  FormObserver as ZenFormObserver,
  FieldArray as ZenFieldArray,
} from 'zenform';
import DropDown from './SimpleDropDown';
import TagsInput from './TagsInput';
import InputGroup from './InputGroup';
import FieldItem from './FieldItem';
import Label from './Label';
import Display from './Display';
import {
  StyledDateInput as DateInput,
  StyledEmailInput as EmailInput,
  StyledNumberInput as NumberInput,
  StyledPasswordInput as PasswordInput,
  StyledPriceInput as PriceInput,
  StyledTextInput as TextInput,
  StyledEnumInput as EnumInput,
  StyledSearchSelectInput as SearchSelectInput,
  StyledSelectInput as SelectInput,
  StyledPartnerSelectInput as PartnerSelectInput,
  StyledCurrencyInput as CurrencyInput,
  StyledIncotermInput as IncotermInput,
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
  DateInput,
  EmailInput,
  NumberInput,
  PasswordInput,
  PriceInput,
  TextInput,
  EnumInput,
  SearchSelectInput,
  PartnerSelectInput,
  SelectInput,
  CurrencyInput,
  IncotermInput,
  DashedPlusButton,
  DropDown,
  TagsInput,
  InputGroup,
};
