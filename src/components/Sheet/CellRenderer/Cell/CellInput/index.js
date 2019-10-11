// @flow
import * as React from 'react';
import TextInput from './Inputs/TextInput';
import TextAreaInput from './Inputs/TextAreaInput';
import NumberInput from './Inputs/NumberInput';
import DateInput from './Inputs/DateInput';
import DatetimeInput from './Inputs/DatetimeInput';
import EnumInput from './Inputs/EnumInput';
import PriceInput from './Inputs/PriceInput';
import { WrapperStyle } from './style';

type Props = {
  value: any,
  type: string,
  focus: boolean,
  inputFocus: boolean,
  disabled: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onUp: () => void,
  onDown: () => void,
  onUpdate: any => void,
};

const inputs = {
  text: TextInput,
  textarea: TextAreaInput,
  number: NumberInput,
  price: PriceInput,
  date: DateInput,
  datetime: DatetimeInput,
  currency: EnumInput.Currency,
  incoterm: EnumInput.Incoterm,
};

const CellInput = ({
  value,
  type,
  focus,
  inputFocus,
  disabled,
  onFocus,
  onBlur,
  onUp,
  onDown,
  onUpdate,
}: Props) => {
  const [dirtyValue, setDirtyValue] = React.useState<any>(value);

  React.useEffect(() => {
    setDirtyValue(value);
  }, [value, setDirtyValue]);

  const handleChange = newValue => {
    if (newValue !== dirtyValue) {
      setDirtyValue(newValue);

      if (!inputFocus) {
        onUpdate(newValue);
      }
    }
  };

  const handleBlur = () => {
    onBlur();

    if (dirtyValue === value) {
      return;
    }

    onUpdate(dirtyValue);
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        break;
      case 'Tab':
        onBlur();
        break;
      case 'Enter':
        e.stopPropagation();
        onBlur();

        if (e.shiftKey) {
          onUp();
        } else {
          onDown();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={WrapperStyle(focus)}>
      {React.createElement(inputs[type], {
        value: dirtyValue,
        readonly: disabled,
        focus: inputFocus,
        onFocus,
        onBlur: handleBlur,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
      })}
    </div>
  );
};

export default CellInput;
