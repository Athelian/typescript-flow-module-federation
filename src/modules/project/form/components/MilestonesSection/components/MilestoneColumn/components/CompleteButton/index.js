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

type OptionalProps = {
  completedAt: ?(string | Date),
  completedBy: ?UserAvatarType,
  onComplete: Object => void,
  onUncomplete: () => void,
};

type Props = OptionalProps;

const defaultProps = {
  completedAt: null,
  completedBy: null,
  onComplete: () => {},
  onUncomplete: () => {},
};

const CompleteButton = ({ completedAt, completedBy, onComplete, onUncomplete }: Props) => (
  <div
    className={TaskStatusInputWrapperStyle({
      isCompleted: !!completedAt,
      // TODO: Add permissions
      editable: true,
    })}
  >
    <div className={UserAvatarWrapperStyle}>
      {completedAt && (
        <>
          <UserAvatar {...completedBy} />

          {/* TODO: Add permissions: if dont have permission then dont render this ui */}
          <button type="button" className={DeactivateButtonStyle} onClick={onUncomplete}>
            <Icon icon="CLEAR" />
          </button>
        </>
      )}
    </div>

    <button
      type="button"
      className={TaskStatusButtonStyle}
      onClick={() => {
        if (!completedAt) {
          // TODO: Add permissions
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

CompleteButton.defaultProps = defaultProps;

export default CompleteButton;
