// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { LabelledButton } from 'components/Buttons';
import type { RenderInputProps } from 'components/Inputs/SelectInput';
import SelectInput from 'components/Inputs/SelectInput';
import type { CellAction as CellActionType } from 'components/Sheet/SheetState/types';
import messages from 'components/Sheet/messages';
import { CellActionWrapperStyle, ButtonStyle } from './style';

type Props = {
  actions: Array<CellActionType>,
  onAction: string => void,
  inputFocus: boolean,
};

const RenderSelectInput = ({ isOpen, getToggleButtonProps }: RenderInputProps) => (
  <LabelledButton
    className={ButtonStyle}
    icon="ACTION"
    label={<FormattedMessage {...messages.actions} />}
    backgroundColor="TEAL"
    hoverBackgroundColor="TEAL_DARK"
    {...getToggleButtonProps({
      onKeyDown: e => {
        if (e.key === 'ArrowDown' || (isOpen && e.key === 'ArrowUp')) {
          e.stopPropagation();
        }
      },
    })}
  />
);

const CellAction = ({ actions, onAction, inputFocus }: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (inputFocus && buttonRef.current) {
      buttonRef.current.focus({
        preventScroll: true,
      });
    }
  }, [inputFocus]);

  return (
    <div className={CellActionWrapperStyle}>
      <SelectInput
        value={null}
        toggleRef={buttonRef}
        onChange={onAction}
        items={actions}
        filterItems={(q, i) => i}
        itemToString={item => item?.label ?? ''}
        itemToValue={item => item?.action ?? null}
        optionWidth={200}
        optionHeight={30}
        renderInput={RenderSelectInput}
        renderOption={SelectInput.DefaultRenderSelectOption}
      />
    </div>
  );
};

export default CellAction;
