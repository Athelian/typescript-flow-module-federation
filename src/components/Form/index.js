import { Form as ZenForm, Field as ZenField, FieldObserver as ZenFieldObserver } from 'zenform';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import DropDown from './SimpleDropDown';
import TagsInput from './TagsInput';

export const Form = ZenForm;
export const Field = ZenField;
export const FieldObserver = ZenFieldObserver;

export { NumberInput, TextInput, DropDown, TagsInput };
