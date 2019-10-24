// @flow
import * as React from 'react';

import SlideView from 'components/SlideView';
import SelectPartner from 'components/SelectPartner';
import Icon from 'components/Icon';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from '../../types';
import { CardStyle, IconStyle, PlusButtonStyle } from './style';

const SelectSinglePartnerInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,

  extra,
}: InputProps<Object, { partnerTypes: Array<string> }>) => (
  <>
    {value ? (
      <button
        tabIndex="-1"
        type="button"
        onClick={() => {
          if (!readonly) {
            onFocus();
          }
        }}
        onKeyDown={onKeyDown}
        className={CardStyle}
      >
        <DisplayWrapper>
          {value.name}
          <div className={IconStyle('PARTNER', false, readonly, false, false)}>
            <Icon icon="PARTNER" />
          </div>
        </DisplayWrapper>
      </button>
    ) : (
      <button
        type="button"
        className={PlusButtonStyle}
        onClick={() => {
          if (!readonly) {
            onFocus();
          }
        }}
      >
        <Icon icon="ADD" />
      </button>
    )}

    <SlideView isOpen={focus} onRequestClose={onBlur}>
      {focus && (
        <SelectPartner
          partnerTypes={extra?.partnerTypes || []}
          selected={value}
          onCancel={onBlur}
          onSelect={newValue => {
            onChange(newValue, true);
            onBlur();
          }}
        />
      )}
    </SlideView>
  </>
);

export default SelectSinglePartnerInput;
