// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import useEnum from 'hooks/useEnum';
import { Display } from 'components/Form';
import messages from 'modules/shipment/messages';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import SearchSelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SearchSelectInput';
import { filterItems, itemToString, itemToValue } from './helpers';

const PortInput = ({
  value,
  context,
  focus,
  onChange,
}: InputProps<{ seaport: ?string, airport: ?string }, 'Air' | 'Sea' | null>) => {
  const intl = useIntl();
  const { enums, loading } = useEnum(context ? `${context}port` : null);
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
    switch (context) {
      case 'Air':
        return value?.airport ?? null;
      case 'Sea':
        return value?.seaport ?? null;
      default:
        return '';
    }
  })();

  const handleChange = newValue => {
    switch (context) {
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

  if (!context) {
    return (
      <Display height="30px" color="GRAY_DARK">
        {intl.formatMessage(messages.selectTransportType)}
      </Display>
    );
  }

  return (
    <SearchSelectInput
      value={inputValue}
      required={false}
      onChange={handleChange}
      focus={focus}
      items={items}
      itemToString={itemToString}
      itemToValue={itemToValue}
      filterItems={filterItems}
    />
  );
};

export default PortInput;
