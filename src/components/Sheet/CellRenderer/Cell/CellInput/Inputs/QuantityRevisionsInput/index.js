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
  OptionStyle,
  AddButtonStyle,
  RemoveButtonStyle,
  InputStyle,
  RevisionWrapperStyle,
} from './style';

const QuantityRevisionTypeSelectInput = (index: number, onBlur: () => void) => ({
  getToggleButtonProps,
  selectedItem,
  isOpen,
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
    <span>{selectedItem}</span>
    <i>
      <Icon icon="CHEVRON_DOWN" />
    </i>
  </button>
);

const QuantityRevisionTypeSelectOption = ({ item, selected, highlighted }: RenderOptionProps) => (
  <div className={OptionStyle(highlighted, selected)}>
    <span>{item}</span>
  </div>
);

const QuantityRevisionsInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<Array<{ id?: string, type: string, quantity: number }>>) => {
  const firstElementRef = React.useRef<HTMLInputElement | HTMLButtonElement | null>(null);
  const { enums } = useEnum('BatchQuantityRevisionType');

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
    onChange((value || []).map((v, i) => (i === index ? { ...v, type: newType } : v)));
  };

  const handleQuantityChange = (index: number) => (e: SyntheticInputEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    onChange((value || []).map((v, i) => (i === index ? { ...v, quantity: newQuantity } : v)));
  };

  const handleRemove = (index: number) => () => {
    onChange((value || []).filter((v, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...(value || []), { type: 'Other', quantity: 0 }]);
  };

  return (
    <div
      className={WrapperStyle}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onBlur();
        }
      }}
    >
      {(value || []).map((revision, index) => (
        <div key={`${revision.id}-${index + 0}`} className={RevisionWrapperStyle}>
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
            renderInput={QuantityRevisionTypeSelectInput(index, onBlur)}
            renderOption={QuantityRevisionTypeSelectOption}
          />
          <hr className={SeparatorStyle} />
          <NumberInput
            className={InputStyle}
            value={revision.quantity}
            nullable={false}
            readOnly={readonly}
            readOnlyHeight="30px"
            onChange={handleQuantityChange(index)}
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
                if ((value || []).length < 5) {
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
            } else {
              onBlur();
            }
          }}
        >
          New Quantity <Icon icon="ADD" />
        </button>
      )}
    </div>
  );
};

export default QuantityRevisionsInput;
