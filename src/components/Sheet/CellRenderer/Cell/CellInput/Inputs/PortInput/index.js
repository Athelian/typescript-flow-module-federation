// @flow
import * as React from 'react';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import SearchSelectInput from '../SearchSelectInput';
import { filterItems, itemToString, itemToValue } from './helpers';

const PortInput = ({
  value,
  extra,
  focus,
  onChange,
  onFocus,
  onBlur,
}: InputProps<{ seaport: ?string, airport: ?string }, 'Air' | 'Sea' | null>) => {
  const { enums, loading } = useEnum(extra ? `${extra}port` : null);
  const items = React.useMemo(
    () =>
      loading
        ? []
        : enums.map(port => ({
            code: port.name,
            name: port.description,
          })),
    [enums, loading]
  );

  const inputValue = (() => {
    switch (extra) {
      case 'Air':
        return value.airport;
      case 'Sea':
        return value.seaport;
      default:
        return null;
    }
  })();

  const handleChange = newValue => {
    switch (extra) {
      case 'Air':
        onChange({ airport: newValue, seaport: null });
        break;
      case 'Sea':
        onChange({ seaport: newValue, airport: null });
        break;
      default:
        break;
    }
  };

  return (
    <SearchSelectInput
      value={inputValue}
      required={false}
      onChange={handleChange}
      focus={focus}
      onFocus={onFocus}
      onBlur={onBlur}
      items={items}
      itemToString={itemToString}
      itemToValue={itemToValue}
      filterItems={filterItems}
    />
  );
};

export default PortInput;
