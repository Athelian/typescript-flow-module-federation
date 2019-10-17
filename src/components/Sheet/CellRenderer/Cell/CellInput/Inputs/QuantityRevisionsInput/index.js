// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import NumberInput from 'components/Form/Inputs/NumberInput';
import useEnum from 'hooks/useEnum';
import type { InputProps } from '../../types';
import {
  WrapperStyle,
  SeparatorStyle,
  SelectInputStyle,
  ArrowDownStyle,
  OptionStyle,
  AddButtonStyle,
  RemoveButtonStyle,
  InputStyle,
  RevisionWrapperStyle,
} from './style';

const QuantityRevisionTypeSelectInput = ({
  getToggleButtonProps,
  selectedItem,
  isOpen,
}: RenderInputProps) => (
  <div className={SelectInputStyle}>
    <span>{selectedItem}</span>
    <button className={ArrowDownStyle(isOpen)} type="button" {...getToggleButtonProps()}>
      <Icon icon="CHEVRON_DOWN" />
    </button>
  </div>
);

const QuantityRevisionTypeSelectOption = ({ item, selected, highlighted }: RenderOptionProps) => (
  <div className={OptionStyle(highlighted, selected)}>
    <span>{item}</span>
  </div>
);

const QuantityRevisionsInput = ({
  value,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  readonly,
}: InputProps<Array<{ id?: string, type: string, quantity: number }>>) => {
  const { enums } = useEnum('BatchQuantityRevisionType');

  const handleTypeChange = (index: number) => (newType: string) => {
    onChange((value || []).map((v, i) => (i === index ? { ...v, type: newType } : v)));
  };

  const handleQuantityChange = (index: number) => (e: SyntheticInputEvent<HTMLInputElement>) => {
    onChange(
      (value || []).map((v, i) =>
        i === index ? { ...v, quantity: parseFloat(e.target.value) } : v
      )
    );
  };

  const handleRemove = (index: number) => () => {
    onChange((value || []).filter((v, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...(value || []), { type: 'Other', quantity: 0 }]);
  };

  return (
    <div className={WrapperStyle}>
      {(value || []).map((revision, index) => (
        <div key={revision.id} className={RevisionWrapperStyle}>
          <SelectInput
            value={revision.type}
            onChange={handleTypeChange(index)}
            items={enums.map(e => e.description || e.name)}
            filterItems={(query, items) => items}
            itemToString={v => v}
            itemToValue={v => v}
            optionWidth={100}
            optionHeight={30}
            renderInput={QuantityRevisionTypeSelectInput}
            renderOption={QuantityRevisionTypeSelectOption}
          />
          <hr className={SeparatorStyle} />
          <NumberInput
            className={InputStyle}
            value={revision.quantity}
            tabIndex="-1"
            nullable={false}
            readOnly={readonly}
            readOnlyHeight="30px"
            onChange={handleQuantityChange(index)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          {!readonly && (
            <button type="button" className={RemoveButtonStyle} onClick={handleRemove(index)}>
              <Icon icon="REMOVE" />
            </button>
          )}
        </div>
      ))}

      {!readonly && (value || []).length < 5 && (
        <button type="button" className={AddButtonStyle} onClick={handleAdd}>
          New Quantity <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
};

export default QuantityRevisionsInput;
