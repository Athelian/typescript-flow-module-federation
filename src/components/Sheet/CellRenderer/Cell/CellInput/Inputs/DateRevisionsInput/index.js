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

const DateRevisionTypeSelectInput = (index: number, onBlur: () => void) => ({
  getToggleButtonProps,
  selectedItem,
  isOpen,
  itemToString,
}: RenderInputProps) => (
  <button
    type="button"
    {...getToggleButtonProps({
      onKeyDown: e => {
        if (!(index === 0 && e.key === 'Tab' && e.shiftKey) || e.key === 'ArrowDown') {
          e.stopPropagation();
        } else {
          onBlur();
        }
      },
    })}
    className={SelectInputStyle(isOpen)}
  >
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
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<Array<{ id?: string, type: string, date: string | Date }>>) => {
  const firstElementRef = React.useRef<HTMLInputElement | HTMLButtonElement | null>(null);
  const { enums } = useEnum('TimelineDateRevisionType');

  React.useEffect(() => {
    if (!firstElementRef.current) {
      return;
    }

    const elem = firstElementRef.current;

    if (focus) {
      // $FlowIssue: Flow doesn't know focus options
      elem.focus({
        preventScroll: true,
      });
    } else {
      elem.blur();
    }
  }, [focus]);

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
    <div
      className={DateRevisionsWrapperStyle}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onBlur();
        }
      }}
    >
      {(value || []).map((revision, index) => (
        <div key={`${revision.id || ''}-${index + 0}`} className={RevisionWrapperStyle}>
          <SelectInput
            value={revision.type}
            onChange={handleTypeChange(index)}
            onFocus={onFocus}
            items={enums.map(e => e.description || e.name)}
            filterItems={(query, items) => items}
            itemToString={v => v}
            itemToValue={v => v}
            optionWidth={200}
            optionHeight={30}
            toggleRef={index === 0 ? firstElementRef : undefined}
            renderInput={DateRevisionTypeSelectInput(index, onBlur)}
            renderOption={DateRevisionTypeSelectOption}
          />
          <hr className={SeparatorStyle} />
          <DateInput
            className={InputStyle}
            value={revision.date}
            readOnly={readonly}
            readOnlyHeight="30px"
            onChange={handleDateChange(index)}
            onFocus={onFocus}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.stopPropagation();
              } else {
                onKeyDown(e);
              }
            }}
          />
          {!readonly && (
            <button
              type="button"
              className={RemoveButtonStyle}
              onClick={handleRemove(index)}
              onFocus={onFocus}
              onKeyDown={e => {
                if ((value || []).length < 5 && e.key === 'Tab') {
                  e.stopPropagation();
                } else {
                  onBlur();
                }
              }}
            >
              <Icon icon="REMOVE" />
            </button>
          )}
        </div>
      ))}

      {!readonly && (value || []).length < 5 && (
        <button
          ref={ref => {
            if ((value || []).length === 0) {
              firstElementRef.current = ref;
            }
          }}
          type="button"
          className={AddButtonStyle}
          onClick={handleAdd}
          onFocus={onFocus}
          onKeyDown={e => {
            if ((value || []).length > 0 && e.key === 'Tab' && e.shiftKey) {
              e.stopPropagation();
            } else if (e.key === 'Tab') {
              onBlur();
            }
          }}
        >
          <FormattedMessage id="modules.Shipments.newDate" />
          <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
};

export default DateRevisionsInput;
