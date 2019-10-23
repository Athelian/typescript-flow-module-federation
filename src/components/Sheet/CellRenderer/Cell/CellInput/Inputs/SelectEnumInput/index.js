// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import { enumToString } from 'components/Form/Factories/helpers';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import SelectInput from '../SelectInput';

type SelectEnumInputImplProps = InputProps<string> & {
  enumType: string,
  required: boolean,
};

const SelectEnumInputImpl = ({
  value,
  onChange,
  onFocus,
  onBlur,
  focus,
  enumType,
  required,
}: SelectEnumInputImplProps) => {
  const intl = useIntl();

  const { enums, loading } = useEnum(enumType);

  if (loading) {
    return (
      <div style={{ padding: 5 }}>
        <LoadingIcon size={10} />
      </div>
    );
  }

  return (
    <SelectInput
      value={value}
      required={required}
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

const SelectEnumInput = (enumType: string, required: boolean) => (props: InputProps<string>) => {
  return <SelectEnumInputImpl {...props} enumType={enumType} required={required} />;
};

export default {
  LoadType: SelectEnumInput('LoadType', false),
  TransportType: SelectEnumInput('TransportType', false),
  ContainerOption: SelectEnumInput('ContainerOption', false),
};
