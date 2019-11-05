// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import CornerIcon from 'components/CornerIcon';
import SlideView from 'components/SlideView';
import { Display } from 'components/Form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import { colors } from 'styles/common';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { SelectorWrapperStyle, SelectorCardStyle, PlusButtonStyle, CornerIconStyle } from './style';

const WarehouseSelectorInput = ({
  value,
  onChange,
  focus,
  forceFocus,
  forceBlur,
  readonly,
}: InputProps<{ id: string, name: string }>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className={SelectorWrapperStyle} onBlur={handleBlur}>
      {value ? (
        <button
          type="button"
          disabled={readonly}
          onClick={forceFocus}
          className={SelectorCardStyle}
        >
          <Display height="20px">{value.name}</Display>

          <CornerIcon icon="WAREHOUSE" color={colors.WAREHOUSE} className={CornerIconStyle} />
        </button>
      ) : (
        <button
          type="button"
          className={PlusButtonStyle}
          disabled={readonly}
          onClick={() => {
            forceFocus();
          }}
        >
          <Icon icon="ADD" />
        </button>
      )}

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        <SelectWareHouse
          selected={value}
          onCancel={forceBlur}
          onSelect={newValue => {
            onChange(newValue, true);
            forceBlur();
          }}
        />
      </SlideView>
    </div>
  );
};

export default WarehouseSelectorInput;
