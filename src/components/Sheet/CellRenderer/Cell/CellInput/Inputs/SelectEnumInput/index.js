// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import { enumToString } from 'components/Form/Factories/helpers';
import useEnum from 'hooks/useEnum';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import SelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SelectInput';

type Props = {
  ...InputProps<string>,
  enumType: string,
  required: boolean,
};

const SelectEnumInputImpl = ({ value, readonly, onChange, focus, enumType, required }: Props) => {
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
      readonly={readonly}
      required={required}
      onChange={onChange}
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
