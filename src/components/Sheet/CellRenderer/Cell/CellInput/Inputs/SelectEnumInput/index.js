// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import { enumToString } from 'components/Form/Factories/helpers';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import SelectInput from '../SelectInput';

type Props = InputProps<string> & {
  enumType: string,
};

const SelectCustomInputImpl = ({ value, onChange, onFocus, onBlur, focus, type }: Props) => {
  const itemToStringFunc = item => (item ? item.label : '');
  const itemToValueFunc = item => (item ? item.value : '');

  let items = [];
  let required = false;

  if (type === 'ContainerType') {
    items = CONTAINER_TYPE_ITEMS;
    required = false;
  }

  return (
    <SelectInput
      value={value}
      required={required}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      items={items}
      itemToString={itemToStringFunc}
      itemToValue={itemToValueFunc}
      focus={focus}
    />
  );
};

const SelectEnumInputImpl = ({ value, onChange, onFocus, onBlur, focus, enumType }: Props) => {
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
  if (enumType === 'ContainerType') {
    return <SelectCustomInputImpl {...props} type={enumType} />;
  }
  return <SelectEnumInputImpl {...props} enumType={enumType} />;
};

export default {
  LoadType: SelectEnumInput('LoadType'),
  TransportType: SelectEnumInput('TransportType'),
  ContainerType: SelectEnumInput('ContainerType'),
  ContainerOption: SelectEnumInput('ContainerOption'),
};
