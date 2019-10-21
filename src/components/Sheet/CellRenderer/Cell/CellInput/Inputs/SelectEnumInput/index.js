// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { enumToString } from 'components/Form/Factories/helpers';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import SelectInput from '../SelectInput';

type Props = InputProps<string> & {
  enumType: string,
};

const SelectEnumInputImpl = ({ value, onChange, onFocus, onBlur, focus, enumType }: Props) => {
  const intl = useIntl();
  const { enums, loading } = useEnum(enumType);

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      items={loading ? [] : enums}
      itemToString={enumToString(enumType, intl)}
      itemToValue={item => item?.name ?? null}
      focus={focus}
    />
  );
};

const SelectEnumInput = (enumType: string) => (props: InputProps<string>) => {
  return <SelectEnumInputImpl {...props} enumType={enumType} />;
};

export default {
  Currency: SelectEnumInput('Currency'),
  Incoterm: SelectEnumInput('Incoterm'),
};
