// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import CornerIcon from 'components/CornerIcon';
import CustomFieldsTemplateSelector from 'components/Form/Factories/CustomFieldsFactory/CustomFieldsTemplateSelector';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  SelectorInputWrapperStyle,
  MaskCardStyle,
  PlusButtonStyle,
  ButtonSelectorStyle,
} from './style';

const MaskSelectorInput = ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
  extra,
}: InputProps<Object, any, { entityType: string }>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className={SelectorInputWrapperStyle} onBlur={handleBlur}>
      <button
        disabled={readonly}
        type="button"
        onClick={forceFocus}
        className={ButtonSelectorStyle}
      >
        {value ? (
          <div className={MaskCardStyle}>
            <Display height="20px">{value.name}</Display>

            <CornerIcon icon="TEMPLATE" color={colors.TEMPLATE} />
          </div>
        ) : (
          <div className={PlusButtonStyle}>
            <Icon icon="ADD" />
          </div>
        )}
      </button>

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        <CustomFieldsTemplateSelector
          entityType={extra?.entityType ?? ''}
          selected={value}
          onCancel={forceBlur}
          onSave={newValue => {
            onChange(newValue, true);
            forceBlur();
          }}
        />
      </SlideView>
    </div>
  );
};

export default MaskSelectorInput;
