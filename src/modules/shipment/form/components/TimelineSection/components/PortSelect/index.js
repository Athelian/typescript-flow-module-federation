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
import usePortOptions from 'components/NavBar/components/Filter/Inputs/Ports/PortInput/hooks';
import {
  filterItems,
  itemToString,
  itemToValue,
} from 'components/NavBar/components/Filter/Inputs/Ports/PortInput/helpers';
import {
  ArrowDownStyle,
  OptionStyle,
  SelectTransportTypeStyle,
} from 'components/NavBar/components/Filter/Inputs/Ports/PortInput/style';
import { ClearButtonStyle } from 'components/Form/Inputs/Styles/DefaultStyle/DefaultSelectStyle/DefaultSelect/style';

type Props = {|
  value: { seaport?: string, airport?: string },
  onChange: ({ seaport?: string, airport?: string }) => void,
  readonly?: boolean,
  name: string,
  width?: number,
  height?: number,
  type: string,
|};

const PortSelectInput = ({
  getInputProps,
  getToggleButtonProps,
  selectedItem,
  isOpen,
  clearSelection,
  width = 200,
  height = 30,
  transportType = 'Sea',
}: RenderInputProps & { transportType?: string }) => {
  const intl = useIntl();
  const icon = transportType === 'Sea' ? 'SHIPMENT' : 'PLANE';
  const { ref, ...inputProps } = getInputProps({
    spellCheck: false,
    placeholder: intl.formatMessage({
      id: 'components.NavBar.Filter.portPlaceholder',
      defaultMessage: 'Please choose a port',
    }),
  });

  return (
    <div
      className={DefaultStyleWrapperStyle({
        type: 'standard',
        isFocused: isOpen,
        hasError: false,
        disabled: false,
        forceHoverStyle: false,
        width: `${width}px`,
        height: `${height}px`,
      })}
    >
      <i className={SelectTransportTypeStyle}>
        <Icon icon={icon} />
      </i>

      <DebounceInput debounceTimeout={500} inputRef={ref} {...inputProps} />

      {!selectedItem ? (
        <button className={ArrowDownStyle(isOpen)} type="button" {...getToggleButtonProps()}>
          <Icon icon="CHEVRON_DOWN" />
        </button>
      ) : (
        <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
          <Icon icon="CLEAR" />
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

const PortSelect = ({
  value,
  name,
  onChange,
  readonly,
  width = 200,
  height = 30,
  type = 'Sea',
}: Props) => {
  const options = usePortOptions().filter(option => option.transportType === type);

  if (readonly) {
    const selectedItem = value ? options.find(item => equals(itemToValue(item), value)) : null;
    return (
      <Display height={`${height}px`} width={`${width}px`}>
        {itemToString(selectedItem)}
      </Display>
    );
  }

  return (
    <SelectInput
      name={name}
      value={value}
      onChange={onChange}
      items={options}
      filterItems={filterItems}
      itemToString={itemToString}
      itemToValue={itemToValue}
      optionHeight={height}
      optionWidth={width}
      renderInput={inputProps => <PortSelectInput {...inputProps} transportType={type} />}
      renderOption={PortSelectOption}
    />
  );
};

export default PortSelect;
