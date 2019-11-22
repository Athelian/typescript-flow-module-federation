// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps } from 'components/Inputs/SelectInput';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { ArrowDownStyle, SelectTextStyle, SelectInputStyle } from './style';

const ContainerType = ({ value, onChange, readonly }: FilterInputProps<?string>) => (
  <>
    <Label height="30px">
      <FormattedMessage {...messages.containerType} />
    </Label>

    <SelectInput
      value={value}
      onChange={onChange}
      disabled={readonly}
      items={CONTAINER_TYPE_ITEMS}
      itemToString={i => i?.label ?? ''}
      itemToValue={i => i?.value ?? null}
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

export default ContainerType;
