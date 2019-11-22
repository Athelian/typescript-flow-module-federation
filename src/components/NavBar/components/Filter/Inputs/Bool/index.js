// @flow
import * as React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Label, ToggleInput } from 'components/Form';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { StatusStyle } from './style';

type ImplProps = {
  ...FilterInputProps<boolean>,
  title: MessageDescriptor,
  onMsg?: MessageDescriptor,
  offMsg?: MessageDescriptor,
};

const BoolImpl = ({ value, readonly, onChange, title, offMsg, onMsg }: ImplProps) => {
  return (
    <>
      <Label height="30px">
        <FormattedMessage {...title} />
      </Label>

      <div className={StatusStyle(value)}>
        <ToggleInput
          toggled={value}
          editable={!readonly}
          onToggle={() => {
            onChange(!value);
          }}
        />

        <span>{value ? <FormattedMessage {...onMsg} /> : <FormattedMessage {...offMsg} />}</span>
      </div>
    </>
  );
};

const Bool = (title: MessageDescriptor, onMsg?: MessageDescriptor, offMsg?: MessageDescriptor) => ({
  value,
  onChange,
  readonly,
}: FilterInputProps<boolean>) => (
  <BoolImpl
    value={value}
    onChange={onChange}
    readonly={readonly}
    title={title}
    onMsg={onMsg}
    offMsg={offMsg}
  />
);

export const CompletelyBatched = Bool(
  messages.completelyBatched,
  messages.completelyBatched,
  messages.notCompletelyBatched
);
export const CompletelyShipped = Bool(
  messages.completelyShipped,
  messages.completelyShipped,
  messages.notCompletelyShipped
);
export const HasShipment = Bool(
  messages.hasShipment,
  messages.hasShipment,
  messages.hasNotShipment
);
export const FreeTimeOverdue = Bool(
  messages.freeTimeOverdue,
  messages.freeTimeOverdue,
  messages.freeTimeNotOverdue
);

export default Bool;
