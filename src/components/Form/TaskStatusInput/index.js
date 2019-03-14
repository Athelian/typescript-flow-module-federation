// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import { type UserAvatarType } from 'types';
import { IN_PROGRESS, COMPLETED } from './constants';
import {
  TaskStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  TaskStatusInputLabelStyle,
  StatusLabelStyle,
} from './style';

export type TaskStatusType = typeof IN_PROGRESS | typeof COMPLETED;

type OptionalProps = {
  width: string,
  activeUser: UserAvatarType,
  showActiveUser: boolean,
  onClickUser: () => void,
  status: TaskStatusType,
  onClick: () => void,
  showCompletedDate: boolean,
  completedDate?: string,
  editable: boolean,
};

type Props = OptionalProps & {};

const defaultProps = {
  width: '200px',
  activeUser: {
    firstName: '',
    lastName: '',
  },
  showActiveUser: false,
  onClickUser: () => {},
  status: IN_PROGRESS,
  onClick: () => {},
  showCompletedDate: false,
  editable: false,
};

const TaskStatusInput = ({
  width,
  activeUser: { firstName, lastName },
  showActiveUser,
  onClickUser,
  status,
  onClick,
  showCompletedDate,
  completedDate,
  editable,
}: Props) => {
  const isInProgress = status === IN_PROGRESS;

  return (
    <BooleanValue>
      {({ value: isHovered, set: changeHoverState }) => (
        <button
          className={TaskStatusInputWrapperStyle({ status, editable, width })}
          onMouseEnter={() => {
            if (editable) {
              changeHoverState(true);
            }
          }}
          onMouseLeave={() => {
            if (editable) {
              changeHoverState(false);
            }
          }}
          onClick={evt => {
            if (editable && isInProgress) {
              evt.stopPropagation();
              onClick();
            }
          }}
          type="button"
        >
          {showActiveUser && (
            <div className={UserAvatarWrapperStyle}>
              <UserAvatar firstName={firstName} lastName={lastName} />
              {editable && (
                <button
                  className={DeactivateButtonStyle}
                  onClick={evt => {
                    evt.stopPropagation();
                    onClickUser();
                  }}
                  type="button"
                >
                  <Icon icon="CLEAR" />
                </button>
              )}
            </div>
          )}

          <div className={TaskStatusInputLabelStyle}>
            <div className={StatusLabelStyle}>
              {isInProgress ? (
                <>
                  {isHovered ? (
                    <FormattedMessage id="components.inputs.complete" defaultMessage="COMPLETE" />
                  ) : (
                    <FormattedMessage
                      id="components.inputs.inProgress"
                      defaultMessage="IN PROGRESS"
                    />
                  )}
                </>
              ) : (
                <FormattedMessage id="components.inputs.completed" defaultMessage="COMPLETED" />
              )}
            </div>

            {!isInProgress && showCompletedDate && (
              <div className={StatusLabelStyle}>
                <FormattedDate value={completedDate} />
              </div>
            )}
          </div>

          <Icon icon={isInProgress ? 'CLOCK' : 'CHECKED'} />
        </button>
      )}
    </BooleanValue>
  );
};

TaskStatusInput.defaultProps = defaultProps;

export default TaskStatusInput;
