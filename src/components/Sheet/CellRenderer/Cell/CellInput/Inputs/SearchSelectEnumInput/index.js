// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import matchSorter from 'match-sorter';
import LoadingIcon from 'components/LoadingIcon';
import { enumToString } from 'components/Form/Factories/helpers';
import useEnum from 'hooks/useEnum';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import SearchSelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SearchSelectInput';

type Props = {
  ...InputProps<string>,
  enumType: string,
  required: boolean,
};

const SearchSelectEnumInputImpl = ({ value, onChange, focus, enumType, required }: Props) => {
  const intl = useIntl();
  const { enums, loading } = useEnum(enumType);

  if (loading) {
    return (
      <div style={{ padding: 5 }}>
        <LoadingIcon size={10} />
      </div>
    );
  }

  const itemToString = enumToString(enumType, intl);

  return (
    <SearchSelectInput
      value={value}
      required={required}
      onChange={onChange}
      items={loading ? [] : enums}
      filterItems={(q: string, options: Array<Object>): Array<Object> => {
        return matchSorter(options, q, {
          keys: ['code', 'name', itemToString],
        });
      }}
      itemToString={itemToString}
      itemToValue={item => item?.name ?? null}
      focus={focus}
    />
  );
};

const SearchSelectEnumInput = (enumType: string, required: boolean) => (
  props: InputProps<string>
) => {
  return <SearchSelectEnumInputImpl {...props} enumType={enumType} required={required} />;
};

export default {
  Currency: SearchSelectEnumInput('Currency', true),
  Incoterm: SearchSelectEnumInput('Incoterm', false),
};
