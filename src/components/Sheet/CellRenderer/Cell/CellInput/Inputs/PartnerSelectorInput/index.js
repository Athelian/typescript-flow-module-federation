// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import SelectPartner from 'components/SelectPartner';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import type { InputProps } from '../../types';
import {
  PartnerSelectorInputWrapperStyle,
  PartnerSelectorCardStyle,
  CornerIconStyle,
  PlusButtonStyle,
} from './style';

const PartnerSelectorInput = (partnerTypes: Array<string>) => ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<Object>) => (
  <div className={PartnerSelectorInputWrapperStyle}>
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
        className={PartnerSelectorCardStyle}
      >
        <Display height="20px">{value.name}</Display>

        <div className={CornerIconStyle}>
          <Icon icon="PARTNER" />
        </div>
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
          partnerTypes={partnerTypes || []}
          selected={value}
          onCancel={onBlur}
          onSelect={newValue => {
            onChange(newValue, true);
            onBlur();
          }}
        />
      )}
    </SlideView>
  </div>
);

export default {
  Exporter: PartnerSelectorInput(['Exporter']),
};
