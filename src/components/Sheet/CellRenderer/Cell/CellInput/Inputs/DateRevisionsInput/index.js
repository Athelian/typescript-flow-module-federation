// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import DateInput from 'components/Form/Inputs/DateInput';
import useEnum from 'hooks/useEnum';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  DateRevisionsWrapperStyle,
  SeparatorStyle,
  SelectInputStyle,
  OptionStyle,
  AddButtonStyle,
  RemoveButtonStyle,
  InputStyle,
  RevisionWrapperStyle,
} from './style';

const DateRevisionTypeSelectInput = ({
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

const DateRevisionTypeSelectOption = ({
  item,
  selected,
  highlighted,
  itemToString,
}: RenderOptionProps) => (
  <div className={OptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const DateRevisionsInput = ({
  value,
  onChange,
  readonly,
}: InputProps<Array<{ id?: string, type: string, date: string | Date }>>) => {
  const { enums } = useEnum('TimelineDateRevisionType');

  const handleTypeChange = (index: number) => (newType: string) => {
    onChange((value || []).map((v, i) => (i === index ? { ...v, type: newType } : v)), true);
  };

  const handleDateChange = (index: number) => (e: SyntheticInputEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onChange((value || []).map((v, i) => (i === index ? { ...v, date: newDate } : v)));
  };

  const handleRemove = (index: number) => () => {
    onChange((value || []).filter((v, i) => i !== index), true);
  };

  const handleAdd = () => {
    onChange([...(value || []), { type: 'Other', date: new Date() }]);
  };

  return (
    <div className={DateRevisionsWrapperStyle}>
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
            renderInput={DateRevisionTypeSelectInput}
            renderOption={DateRevisionTypeSelectOption}
          />
          <hr className={SeparatorStyle} />
          <DateInput
            className={InputStyle}
            value={revision.date}
            readOnly={readonly}
            readOnlyWidth="100%"
            readOnlyHeight="30px"
            onChange={handleDateChange(index)}
            required
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
          <FormattedMessage id="modules.Shipments.newDate" />
          <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
};

export default DateRevisionsInput;
