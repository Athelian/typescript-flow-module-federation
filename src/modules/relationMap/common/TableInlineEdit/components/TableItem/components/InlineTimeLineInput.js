// @flow
import * as React from 'react';
import { UserConsumer } from 'modules/user';
import { ApproveIconButton } from 'components/Buttons';
import { DefaultStyle, DateInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useTimeLineInput } from 'modules/relationMap/common/TableInlineEdit/hooks';
import { ApprovalWrapperStyle } from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';

type Props = {
  name: string,
  value: Object,
};

export default function InlineTimeLineInput({ name, value }: Props) {
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
    <div className={ApprovalWrapperStyle}>
      <DefaultStyle
        width="150px"
        type="date"
        isFocused={isFocused}
        hasError={false}
        forceHoverStyle
      >
        <DateInput
          align="left"
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
      {delayDays}
      <UserConsumer>
        {({ user }) => (
          <ApproveIconButton
            hasApproved={hasApproved}
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
          />
        )}
      </UserConsumer>
    </div>
  );
}
