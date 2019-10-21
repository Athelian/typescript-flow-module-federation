// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import DebounceInput from 'react-debounce-input';
import Icon from 'components/Icon';
import BaseSelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import messages from 'components/Form/Inputs/messages';
import { SelectInputStyle, SelectOptionStyle, ArrowDownStyle, ClearButtonStyle } from './style';

type Props = {
  value: any | null,
  onChange: any => void,
  onFocus: () => void,
  onBlur: () => void,
  items: Array<any>,
  filterItems: (string, Array<any>) => Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  focus: boolean,
};

const Select = ({
  clearSelection,
  getInputProps,
  getToggleButtonProps,
  selectedItem,
  isOpen,
}: RenderInputProps) => {
  const intl = useIntl();

  const { ref, ...inputProps } = getInputProps({
    spellCheck: false,
    placeholder: intl.formatMessage(messages.defaultPlaceholder),
  });

  return (
    <div className={SelectInputStyle}>
      <DebounceInput debounceTimeout={500} inputRef={ref} {...inputProps} />

      {selectedItem ? (
        <button className={ClearButtonStyle} type="button" onClick={() => clearSelection()}>
          <Icon icon="CLEAR" />
        </button>
      ) : (
        <button className={ArrowDownStyle(isOpen)} type="button" {...getToggleButtonProps()}>
          <Icon icon="CHEVRON_DOWN" />
        </button>
      )}
    </div>
  );
};

const Option = ({ selected, highlighted, item, itemToString }: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const SearchSelectInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  items,
  filterItems,
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
      inputRef={inputRef}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      items={items}
      filterItems={filterItems}
      itemToString={itemToString}
      itemToValue={itemToValue}
      optionHeight={30}
      optionWidth={200}
      renderInput={Select}
      renderOption={Option}
    />
  );
};

export default SearchSelectInput;
