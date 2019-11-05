// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import SelectPartners from 'components/SelectPartners';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { IconStyle, PartnerCardStyle } from './style';

const PartnersSelectorInput = (partnerTypes: Array<string>) => ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
}: InputProps<Array<Object>>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div onBlur={handleBlur}>
      <button disabled={readonly} type="button" onClick={forceFocus}>
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

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        {focus && (
          <SelectPartners
            partnerTypes={partnerTypes || []}
            selected={value || []}
            onCancel={forceBlur}
            onSelect={newValue => {
              onChange(newValue, true);
              forceBlur();
            }}
          />
        )}
      </SlideView>
    </div>
  );
};

export default {
  Forwarders: PartnersSelectorInput(['Forwarder']),
};
