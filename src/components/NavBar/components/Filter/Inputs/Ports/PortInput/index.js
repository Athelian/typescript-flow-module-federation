// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import DebounceInput from 'react-debounce-input';
import { equals } from 'ramda';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import messages from '../../../messages';
import usePortOptions from './hooks';
import { filterItems, itemToString, itemToValue } from './helpers';
import { ArrowDownStyle, OptionStyle, SelectTransportTypeStyle } from './style';

type Props = {
  value: { seaport?: string, airport?: string },
  onChange: ({ seaport?: string, airport?: string }) => void,
  readonly: boolean,
};

const PortSelectInput = ({
  getInputProps,
  getToggleButtonProps,
  selectedItem,
  isOpen,
}: RenderInputProps) => {
  const intl = useIntl();

  let icon = 'UNKNOWN';
  if (selectedItem) {
    icon = selectedItem.transportType === 'Sea' ? 'SHIPMENT' : 'PLANE';
  }

  const { ref, ...inputProps } = getInputProps({
    spellCheck: false,
    placeholder: intl.formatMessage(messages.portPlaceholder),
  });

  return (
    <div
      className={DefaultStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError: false,
        disabled: false,
        forceHoverStyle: false,
        width: '200px',
        height: '30px',
      })}
    >
      <i className={SelectTransportTypeStyle}>
        <Icon icon={icon} />
      </i>

      <DebounceInput debounceTimeout={500} inputRef={ref} {...inputProps} />

      {!selectedItem && (
        <button className={ArrowDownStyle(isOpen)} type="button" {...getToggleButtonProps()}>
          <Icon icon="CHEVRON_DOWN" />
        </button>
      )}
    </div>
  );
};

const PortSelectOption = ({ item, selected, highlighted }: RenderOptionProps) => {
  return (
    <div className={OptionStyle(highlighted, selected)}>
      <i className={SelectTransportTypeStyle}>
        <Icon icon={item.transportType === 'Sea' ? 'SHIPMENT' : 'PLANE'} />
      </i>
      <span>{itemToString(item)}</span>
    </div>
  );
};

const PortInput = ({ value, onChange, readonly }: Props) => {
  const options = usePortOptions();

  if (readonly) {
    const selectedItem = value ? options.find(item => equals(itemToValue(item), value)) : null;
    return (
      <Display height="30px" width="200px">
        {itemToString(selectedItem)}
      </Display>
    );
  }

  return (
    <SelectInput
      name="port"
      value={value}
      onChange={onChange}
      items={options}
      filterItems={filterItems}
      itemToString={itemToString}
      itemToValue={itemToValue}
      optionHeight={30}
      optionWidth={200}
      renderInput={PortSelectInput}
      renderOption={PortSelectOption}
    />
  );
};

export default PortInput;
