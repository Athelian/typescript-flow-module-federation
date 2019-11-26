// @flow
import * as React from 'react';
import DebounceInput from 'react-debounce-input';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { enumToString, filterItems } from 'components/Form/Factories/helpers';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps } from 'components/Inputs/SelectInput';
import useEnum from 'hooks/useEnum';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { ArrowDownStyle, SelectInputStyle } from './style';

const Country = ({ value, onChange, readonly }: FilterInputProps<?string>) => {
  const intl = useIntl();
  const { enums, loading } = useEnum('Country');

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.country} />
      </Label>

      <SelectInput
        value={value}
        onChange={onChange}
        disabled={readonly || loading}
        items={loading ? [] : enums}
        filterItems={filterItems}
        itemToString={enumToString('Country', intl)}
        itemToValue={item => item?.name ?? null}
        renderInput={({ getInputProps, getToggleButtonProps, isOpen }: RenderInputProps) => {
          const { ref, ...inputProps } = getInputProps({
            spellCheck: false,
            placeholder: intl.formatMessage(messages.countryPlaceholder),
          });

          return (
            <div className={SelectInputStyle(isOpen)}>
              <DebounceInput debounceTimeout={500} inputRef={ref} {...inputProps} />

              <button className={ArrowDownStyle(isOpen)} type="button" {...getToggleButtonProps()}>
                <Icon icon="CHEVRON_DOWN" />
              </button>
            </div>
          );
        }}
        renderOption={SelectInput.DefaultRenderSelectOption}
      />
    </>
  );
};

export default Country;
