// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import matchSorter from 'match-sorter';
import { enumToString } from 'components/Form/Factories/helpers';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import SearchSelectInput from '../SearchSelectInput';

type Props = InputProps<string> & {
  enumType: string,
};

const SearchSelectEnumInputImpl = ({
  value,
  onChange,
  onFocus,
  onBlur,
  focus,
  enumType,
}: Props) => {
  const intl = useIntl();
  const { enums, loading } = useEnum(enumType);

  const itemToString = enumToString(enumType, intl);

  const nullable = enumType === 'Incoterm';

  return (
    <SearchSelectInput
      value={value}
      nullable={nullable}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
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

const SearchSelectEnumInput = (enumType: string) => (props: InputProps<string>) => {
  return <SearchSelectEnumInputImpl {...props} enumType={enumType} />;
};

export default {
  Currency: SearchSelectEnumInput('Currency'),
  Incoterm: SearchSelectEnumInput('Incoterm'),
};
