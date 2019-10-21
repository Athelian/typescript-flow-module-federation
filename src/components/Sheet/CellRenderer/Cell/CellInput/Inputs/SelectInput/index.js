// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import BaseSelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import { SelectInputStyle, SelectOptionStyle } from './style';

type Props = {
  value: any | null,
  onChange: any => void,
  onFocus: () => void,
  onBlur: () => void,
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  focus: boolean,
};

const Select = ({ getToggleButtonProps, selectedItem, isOpen, itemToString }: RenderInputProps) => (
  <button
    type="button"
    className={SelectInputStyle(isOpen)}
    {...getToggleButtonProps({
      onKeyDown: e => {
        if (e.key === 'ArrowDown') {
          e.stopPropagation();
        }
      },
    })}
  >
    <span>{itemToString(selectedItem)}</span>
    <i>
      <Icon icon="CHEVRON_DOWN" />
    </i>
  </button>
);

const Option = ({ selected, highlighted, item, itemToString }: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const SelectInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  items,
  itemToString,
  itemToValue,
  focus,
}: Props) => {
  const inputRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const input = inputRef.current;

    if (focus) {
      // $FlowIssue: Flow doesn't know focus options
      input.focus({
        preventScroll: true,
      });
    } else {
      input.blur();
    }
  }, [focus]);

  return (
    <BaseSelectInput
      toggleRef={inputRef}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      items={items}
      filterItems={(q, i) => i}
      itemToString={itemToString}
      itemToValue={itemToValue}
      optionHeight={30}
      optionWidth={200}
      renderInput={Select}
      renderOption={Option}
    />
  );
};

export default SelectInput;
