// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import SlideView from 'components/SlideView';
import SelectPartner from 'components/SelectPartner';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import CornerIcon from 'components/CornerIcon';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  PartnerSelectorInputWrapperStyle,
  PartnerCardStyle,
  PartnerCodeStyle,
  PlusButtonStyle,
} from './style';

type ExtraProps = {|
  partnerTypes: Array<string>,
  confirmationDialogMessage?: ?string | React.Node,
  deselectDialogMessage?: ?string | React.Node,
  isRequired?: boolean,
|};

const PartnerSelectorInput = ({
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

  const name = value?.partner?.name || value?.name || value?.organization?.name || '';
  const code = value?.partner?.code || '';

  return (
    <div className={PartnerSelectorInputWrapperStyle} onBlur={handleBlur}>
      {value ? (
        <button disabled={readonly} type="button" onClick={forceFocus} className={PartnerCardStyle}>
          <Display height="20px">{name}</Display>
          <div className={PartnerCodeStyle}>{code}</div>
          <CornerIcon icon="PARTNER" color={colors.PARTNER} />
        </button>
      ) : (
        <button disabled={readonly} type="button" className={PlusButtonStyle} onClick={forceFocus}>
          <Icon icon="ADD" />
        </button>
      )}

      <SlideView isOpen={focus} onRequestClose={forceBlur}>
        <SelectPartner
          partnerTypes={extra?.partnerTypes ?? []}
          confirmationDialogMessage={extra?.confirmationDialogMessage ?? null}
          deselectDialogMessage={extra?.deselectDialogMessage ?? null}
          isRequired={extra?.isRequired ?? false}
          selected={value}
          onCancel={forceBlur}
          onSelect={newValue => {
            onChange(newValue?.organization, true);
            forceBlur();
          }}
        />
      </SlideView>
    </div>
  );
};

export default PartnerSelectorInput;
