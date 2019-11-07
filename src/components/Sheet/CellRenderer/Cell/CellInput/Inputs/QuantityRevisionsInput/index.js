// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import NumberInput from 'components/Inputs/NumberInput';
import useEnum from 'hooks/useEnum';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  WrapperStyle,
  SeparatorStyle,
  SelectInputStyle,
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
  itemToString,
}: RenderInputProps) => (
  <button type="button" {...getToggleButtonProps()} className={SelectInputStyle(isOpen)}>
    <span>{itemToString(selectedItem)}</span>
    <i>
      <Icon icon="CHEVRON_DOWN" />
    </i>
  </button>
);

const QuantityRevisionTypeSelectOption = ({
  item,
  selected,
  highlighted,
  itemToString,
}: RenderOptionProps) => (
  <div className={OptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const QuantityRevisionsInput = ({
  value,
  onChange,
  readonly,
}: InputProps<Array<{ id?: string, type: string, quantity: number | string }>>) => {
  const { enums } = useEnum('BatchQuantityRevisionType');

  const handleTypeChange = (index: number) => (newType: string) => {
    onChange((value || []).map((v, i) => (i === index ? { ...v, type: newType } : v)), true);
  };

  const handleQuantityChange = (index: number) => (e: SyntheticInputEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    onChange((value || []).map((v, i) => (i === index ? { ...v, quantity: newQuantity } : v)));
  };

  const handleRemove = (index: number) => () => {
    onChange((value || []).filter((v, i) => i !== index), true);
  };

  const handleAdd = () => {
    onChange([...(value || []), { type: 'Other', quantity: 0 }]);
  };

  return (
    <div className={WrapperStyle}>
      {(value || []).map((revision, index) => (
        <div key={`${revision.id || ''}-${index + 0}`} className={RevisionWrapperStyle}>
          <SelectInput
            value={revision.type}
            onChange={handleTypeChange(index)}
            items={enums.map(e => e.description || e.name)}
            filterItems={(query, items) => items}
            itemToString={v => v}
            itemToValue={v => v}
            optionWidth={200}
            optionHeight={30}
            renderInput={QuantityRevisionTypeSelectInput}
            renderOption={QuantityRevisionTypeSelectOption}
          />
          <hr className={SeparatorStyle} />
          <NumberInput
            className={InputStyle}
            value={revision.quantity}
            required
            disabled={readonly}
            onChange={handleQuantityChange(index)}
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
          <FormattedMessage id="modules.Batches.newQuantity" defaultMessage="NEW QUANTITY" />
          <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
};

export default QuantityRevisionsInput;
