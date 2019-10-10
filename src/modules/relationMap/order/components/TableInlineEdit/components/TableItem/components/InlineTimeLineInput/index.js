// @flow
import * as React from 'react';
import { UserConsumer } from 'contexts/Viewer';
import { DefaultStyle, DateInput } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import emitter from 'utils/emitter';
import { useTimeLineInput } from 'modules/form/hooks';
import {
  InlineTimeLineInputWrapperStyle,
  DelayStyle,
  ApproveButtonStyle,
  DateInputWrapperStyle,
} from './style';

type Props = {
  name: string,
  value: Object,
  id: string,
};

export default function InlineTimeLineInput({ name, value, id }: Props) {
  const {
    isFocused,
    hasApproved,
    getTimeLine,
    handleApprove,
    handleUnapprove,
    delayDays,
    ...inputHandlers
  } = useTimeLineInput(value);
  return (
    <div className={InlineTimeLineInputWrapperStyle}>
      <DefaultStyle width="120px" type="date" isFocused={isFocused} hasError={false}>
        <DateInput
          align="left"
          id={`input-${id}`}
          className={DateInputWrapperStyle}
          name={name}
          {...inputHandlers}
          onBlur={() => {
            inputHandlers.onBlur();
            emitter.emit('INLINE_CHANGE', {
              name,
              hasError: false,
              value: getTimeLine(inputHandlers.value),
            });
          }}
        />
      </DefaultStyle>

      <div className={DelayStyle(delayDays)}>
        {delayDays !== 0 && (
          <>
            {delayDays > 0 ? '+' : ''}
            <FormattedNumber value={delayDays} />
          </>
        )}
      </div>

      <UserConsumer>
        {({ user }) => (
          <button
            className={ApproveButtonStyle(hasApproved)}
            type="button"
            onClick={() => {
              if (hasApproved) {
                handleUnapprove(result => {
                  emitter.emit('INLINE_CHANGE', {
                    name,
                    hasError: false,
                    value: result,
                  });
                });
              } else {
                handleApprove(user, result => {
                  emitter.emit('INLINE_CHANGE', {
                    name,
                    hasError: false,
                    value: result,
                  });
                });
              }
            }}
          >
            <Icon icon="CHECKED" />
          </button>
        )}
      </UserConsumer>
    </div>
  );
}
