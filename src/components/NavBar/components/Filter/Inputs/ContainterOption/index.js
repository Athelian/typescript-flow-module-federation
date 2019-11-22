// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { enumToString } from 'components/Form/Factories/helpers';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps } from 'components/Inputs/SelectInput';
import useEnum from 'hooks/useEnum';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { ArrowDownStyle, SelectTextStyle, SelectInputStyle } from './style';

const ContainerOption = ({ value, onChange, readonly }: FilterInputProps<?string>) => {
  const intl = useIntl();
  const { enums, loading } = useEnum('ContainerOption');

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.containerOption} />
      </Label>

      <SelectInput
        value={value}
        onChange={onChange}
        disabled={readonly || loading}
        items={loading ? [] : enums}
        itemToString={enumToString('ContainerOption', intl)}
        itemToValue={item => item?.name ?? null}
        renderInput={({
          getToggleButtonProps,
          selectedItem,
          isOpen,
          itemToString,
        }: RenderInputProps) => (
          <button type="button" {...getToggleButtonProps()} className={SelectInputStyle(isOpen)}>
            <span className={SelectTextStyle(!!selectedItem)}>{itemToString(selectedItem)}</span>
            {!selectedItem && (
              <i className={ArrowDownStyle(isOpen)}>
                <Icon icon="CHEVRON_DOWN" />
              </i>
            )}
          </button>
        )}
        renderOption={SelectInput.DefaultRenderSelectOption}
      />
    </>
  );
};

export default ContainerOption;
