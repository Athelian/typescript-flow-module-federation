// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { enumToString } from 'components/Form/Factories/helpers';
import EnumProvider from 'providers/enum';
import SelectInput from '../SelectInput';

type Props = {
  value: string | null,
  onChange: string => void,
  onFocus: () => void,
  onBlur: () => void,
  focus: boolean,
  readonly: boolean,
  intl: IntlShape,
};

const EnumInput = (enumType: string) => {
  return injectIntl(({ value, onChange, onFocus, onBlur, focus, readonly, intl }: Props) => {
    return (
      <EnumProvider enumType={enumType}>
        {({ loading, data }) => {
          return (
            <SelectInput
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              items={loading ? [] : data}
              itemToString={enumToString(enumType, intl)}
              itemToValue={item => item?.name ?? null}
              focus={focus}
              readonly={readonly}
              required={false}
            />
          );
        }}
      </EnumProvider>
    );
  });
};

export default {
  Currency: EnumInput('Currency'),
  Incoterm: EnumInput('Incoterm'),
};
