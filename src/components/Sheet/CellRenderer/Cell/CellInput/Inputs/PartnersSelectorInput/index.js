// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import SelectPartners from 'components/SelectPartners';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from '../../types';
import { IconStyle, PartnerCardStyle } from './style';

const PartnersSelectorInput = (partnerTypes: Array<string>) => ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<Array<Object>>) => (
  <div>
    <button
      tabIndex="-1"
      type="button"
      onClick={() => {
        if (!readonly) {
          onFocus();
        }
      }}
      onKeyDown={onKeyDown}
    >
      <DisplayWrapper>
        {(value || []).map(item => (
          <div key={item.id} className={PartnerCardStyle}>
            <Display height="20px">{item.name}</Display>
            <div className={IconStyle('PARTNER', false, readonly, false, false)}>
              <Icon icon="PARTNER" />
            </div>
          </div>
        ))}
      </DisplayWrapper>
    </button>

    <SlideView isOpen={focus} onRequestClose={onBlur}>
      {focus && (
        <SelectPartners
          partnerTypes={partnerTypes || []}
          selected={value || []}
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
  Forwarders: PartnersSelectorInput(['Forwarder']),
};
