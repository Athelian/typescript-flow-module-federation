// @flow
import * as React from 'react';
import { UserConsumer } from 'contexts/Viewer';
import { DefaultStyle, DateTimeInput } from 'components/Form';
import Icon from 'components/Icon';
import emitter from 'utils/emitter';
import { useDateTimeApprovalInput } from 'modules/form/hooks';
import {
  InlineDateTimeApprovalInputWrapperStyle,
  ApproveButtonStyle,
  DateInputWrapperStyle,
} from './style';

type Props = {
  name: string,
  value: Object,
  id: string,
};

export default function InlineDateTimeApprovalInput({ name, value, id }: Props) {
  const {
    isFocused,
    hasApproved,
    handleApprove,
    handleUnapprove,
    ...inputHandlers
  } = useDateTimeApprovalInput(value);
  return (
    <div className={InlineDateTimeApprovalInputWrapperStyle}>
      <DefaultStyle width="160px" type="date" isFocused={isFocused} hasError={false}>
        <DateTimeInput
          align="left"
          id={`input-${id}`}
          className={DateInputWrapperStyle}
          name={name}
          /* $FlowFixMe This comment suppresses an error found when upgrading
           * Flow to v0.112.0. To view the error, delete this comment and run
           * Flow. */
          {...inputHandlers}
          onBlur={() => {
            inputHandlers.onBlur();
            emitter.emit('INLINE_CHANGE', {
              name,
              hasError: false,
              value: inputHandlers.value,
            });
          }}
        />
      </DefaultStyle>

      <UserConsumer>
        {({ user }) => (
          <button
            className={ApproveButtonStyle(hasApproved)}
            type="button"
            onClick={() => {
              if (hasApproved) {
                handleUnapprove(result => {
                  emitter.emit('INLINE_CHANGE', {
                    name: `${name}ApprovedBy`,
                    hasError: false,
                    value: result.approvedBy,
                  });
                  emitter.emit('INLINE_CHANGE', {
                    name: `${name}ApprovedAt`,
                    hasError: false,
                    value: result.approvedAt,
                  });
                });
              } else {
                handleApprove(user, result => {
                  emitter.emit('INLINE_CHANGE', {
                    name: `${name}ApprovedBy`,
                    hasError: false,
                    value: result.approvedBy,
                  });
                  emitter.emit('INLINE_CHANGE', {
                    name: `${name}ApprovedAt`,
                    hasError: false,
                    value: result.approvedAt,
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
