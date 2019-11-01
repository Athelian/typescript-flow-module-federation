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
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<{ id: string, name: string }>) => {
  return (
    <div className={SelectorWrapperStyle}>
      {value ? (
        <button
          tabIndex="-1"
          type="button"
          disabled={readonly}
          onClick={() => {
            onFocus();
          }}
          onKeyDown={onKeyDown}
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
            onFocus();
          }}
        >
          <Icon icon="ADD" />
        </button>
      )}

      <SlideView isOpen={focus} onRequestClose={onBlur}>
        <SelectWareHouse
          selected={value}
          onCancel={onBlur}
          onSelect={newValue => {
            onChange(newValue, true);
            onBlur();
          }}
        />
      </SlideView>
    </div>
  );
};

export default WarehouseSelectorInput;
