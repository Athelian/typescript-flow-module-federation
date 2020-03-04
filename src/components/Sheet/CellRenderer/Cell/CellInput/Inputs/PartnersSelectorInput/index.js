// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import SlideView from 'components/SlideView';
import SelectPartners from 'components/SelectPartners';
import { Display } from 'components/Form';
import Icon from 'components/Icon';
import CornerIcon from 'components/CornerIcon';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { PartnerCardStyle, CardsWrapperStyle, ButtonStyle, PlusButtonStyle } from './style';

type ExtraProps = {
  partnerTypes: Array<string>,
};

const PartnersSelectorInput = ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
  extra,
}: InputProps<Array<Object>, any, ExtraProps>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  return (
    <div onBlur={handleBlur}>
      <button disabled={readonly} type="button" onClick={forceFocus} className={ButtonStyle}>
        <div className={CardsWrapperStyle}>
          {(value || []).length ? (
            (value || []).map(item => (
              <div key={item.id} className={PartnerCardStyle}>
                <Display height="20px">{item.name}</Display>

                <CornerIcon icon="PARTNER" color={colors.PARTNER} />
              </div>
            ))
          ) : (
            <div className={PlusButtonStyle}>
              <Icon icon="ADD" />
            </div>
          )}
        </div>
      </button>

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        <SelectPartners
          partnerTypes={extra?.partnerTypes ?? []}
          selected={value || []}
          onCancel={forceBlur}
          onSelect={newValue => {
            onChange(
              newValue.map(newVal => newVal?.organization),
              true
            );
            forceBlur();
          }}
        />
      </SlideView>
    </div>
  );
};

export default PartnersSelectorInput;
