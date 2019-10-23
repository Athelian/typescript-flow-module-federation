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
};

const SelectEnumInputImpl = ({
  value,
  onChange,
  onFocus,
  onBlur,
  focus,
  enumType,
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

  const required = false;

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

const SelectEnumInput = (enumType: string) => (props: InputProps<string>) => {
  return <SelectEnumInputImpl {...props} enumType={enumType} />;
};

export default {
  LoadType: SelectEnumInput('LoadType'),
  TransportType: SelectEnumInput('TransportType'),
  ContainerOption: SelectEnumInput('ContainerOption'),
};
