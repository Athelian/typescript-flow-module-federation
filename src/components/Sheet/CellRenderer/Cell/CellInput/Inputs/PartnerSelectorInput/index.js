// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import SelectPartner from 'components/SelectPartner';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  PartnerSelectorInputWrapperStyle,
  PartnerSelectorCardStyle,
  CornerIconStyle,
  PlusButtonStyle,
} from './style';

type ExtraProps = { confirmationDialogMessage?: ?string | React.Node, isRequired?: boolean };

const PartnerSelectorInput = (partnerTypes: Array<string>) => ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
  extra,
}: InputProps<Object, any, ExtraProps>) => {
  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className={PartnerSelectorInputWrapperStyle} onBlur={handleBlur}>
      {value ? (
        <button
          disabled={readonly}
          type="button"
          onClick={forceFocus}
          className={PartnerSelectorCardStyle}
        >
          <Display height="20px">{value.name}</Display>

          <div className={CornerIconStyle}>
            <Icon icon="PARTNER" />
          </div>
        </button>
      ) : (
        <button disabled={readonly} type="button" className={PlusButtonStyle} onClick={forceFocus}>
          <Icon icon="ADD" />
        </button>
      )}

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        {focus && (
          <SelectPartner
            partnerTypes={partnerTypes || []}
            selected={value}
            onCancel={forceBlur}
            onSelect={newValue => {
              onChange(newValue, true);
              forceBlur();
            }}
            confirmationDialogMessage={extra?.confirmationDialogMessage ?? null}
            isRequired={extra?.isRequired ?? false}
          />
        )}
      </SlideView>
    </div>
  );
};

export default {
  Exporter: PartnerSelectorInput(['Exporter']),
};
