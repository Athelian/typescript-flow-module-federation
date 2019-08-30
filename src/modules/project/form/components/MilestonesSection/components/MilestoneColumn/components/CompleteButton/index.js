// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { type UserAvatarType } from 'types';
import {
  TaskStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  TaskStatusButtonStyle,
  TaskStatusInputLabelStyle,
  StatusLabelStyle,
} from './style';

type Props = {|
  completedAt: ?(string | Date),
  completedBy: ?UserAvatarType,
  onComplete: Object => void,
  onUnComplete: () => void,
  editable: boolean,
|};

const CompleteButton = ({
  editable,
  completedAt,
  completedBy,
  onComplete,
  onUnComplete,
}: Props) => (
  <div
    className={TaskStatusInputWrapperStyle({
      isCompleted: !!completedAt,
      editable,
    })}
  >
    <div className={UserAvatarWrapperStyle}>
      {completedAt && (
        <>
          <UserAvatar {...completedBy} />
          {editable && (
            <button
              type="button"
              className={DeactivateButtonStyle}
              onClick={event => {
                event.stopPropagation();
                onUnComplete();
              }}
            >
              <Icon icon="CLEAR" />
            </button>
          )}
        </>
      )}
    </div>

    <button
      type="button"
      className={TaskStatusButtonStyle}
      onClick={event => {
        event.stopPropagation();

        if (!completedAt && editable) {
          onComplete();
        }
      }}
    >
      <div className={TaskStatusInputLabelStyle}>
        <div className={StatusLabelStyle}>
          {completedAt ? (
            <FormattedMessage id="components.form.completed" defaultMessage="COMPLETED" />
          ) : (
            <FormattedMessage id="components.form.unCompleted" defaultMessage="UNCOMPLETED" />
          )}
        </div>

        {completedAt && (
          <div className={StatusLabelStyle}>
            <FormattedDate value={completedAt} />
          </div>
        )}
      </div>

      {completedAt && <Icon icon="CHECKED" />}
    </button>
  </div>
);

export default CompleteButton;
