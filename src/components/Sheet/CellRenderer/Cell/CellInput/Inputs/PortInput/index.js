// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import useEnum from 'hooks/useEnum';
import TextDisplay from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/TextDisplay';
import messages from 'modules/shipment/messages';
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
  const intl = useIntl();
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
        return value?.airport ?? null;
      case 'Sea':
        return value?.seaport ?? null;
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
      case null:
        onChange(null);
        break;
      default:
        break;
    }
  };

  if (!extra) {
    return <TextDisplay value={intl.formatMessage(messages.transportTypeWarningMessage)} />;
  }

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
