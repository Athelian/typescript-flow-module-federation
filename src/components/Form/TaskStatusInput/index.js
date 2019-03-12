// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import { type UserAvatarType } from 'types';
import { IN_PROGRESS, COMPLETED } from './constants';
import {
  TaskStatusInputWrapperStyle,
  UserAvatarWrapperStyle,
  DeactivateButtonStyle,
  TaskStatusInputLabelStyle,
} from './style';

export type TaskStatusType = typeof IN_PROGRESS | typeof COMPLETED;

type OptionalProps = {
  width: string,
  activeUser: UserAvatarType,
  showActiveUser: boolean,
  onClickUser: () => void,
  status: TaskStatusType,
  onClick: () => void,
  editable: boolean,
};

type Props = OptionalProps;

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
  editable: false,
};

const TaskStatusInput = ({
  width,
  activeUser: { firstName, lastName },
  showActiveUser,
  onClickUser,
  status,
  onClick,
  editable,
}: Props) => {
  const isInProgress = status === IN_PROGRESS;

  return (
    <BooleanValue>
      {({ value: isHovered, set: changeHoverState }) => {
        return (
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
            onClick={() => {
              if (editable) {
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
              {isInProgress ? (
                <>
                  {isHovered ? (
                    <FormattedMessage id="components.inputs.complete" defaultValue="COMPLETE" />
                  ) : (
                    <FormattedMessage
                      id="components.inputs.inProgress"
                      defaultValue="IN PROGRESS"
                    />
                  )}
                </>
              ) : (
                <FormattedMessage id="components.inputs.completed" defaultValue="COMPLETED" />
              )}
            </div>

            <Icon icon={isInProgress ? 'CLOCK' : 'CHECKED'} />
          </button>
        );
      }}
    </BooleanValue>
  );
};

TaskStatusInput.defaultProps = defaultProps;

export default TaskStatusInput;
