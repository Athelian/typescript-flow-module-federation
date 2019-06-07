// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import { type UserAvatarType } from 'types';
import AssignUsers from '../components/AssignUsers';
import { MAX_USERS_ALLOWED } from '../constants';
import {
  TaskAssignmentWrapperStyle,
  TaskAssignmentStyle,
  UserStyle,
  DeactivateButtonStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
  ConfirmIconWrapperStyle,
} from './style';

type OptionalProps = {
  users: Array<UserAvatarType>,
  activeUserId: ?string,
  onChange: (values: Array<UserAvatarType>) => void,
  onActivateUser: ?(UserAvatarType) => void,
  onDeactivateUser: () => void,
  editable: boolean,
  onToggleSlideView: boolean => void,
};

type Props = OptionalProps & {
  groupIds: Array<string>,
};

const defaultProps = {
  users: [],
  onChange: () => {},
  onActivateUser: null,
  onDeactivateUser: () => {},
  onToggleSlideView: () => {},
  editable: false,
};

const TaskAssignmentInput = ({
  users,
  activeUserId,
  onChange,
  onActivateUser,
  onDeactivateUser,
  onToggleSlideView,
  editable,
  groupIds,
}: Props) => {
  return (
    <div className={TaskAssignmentWrapperStyle}>
      {users.map(user => {
        const { id, firstName, lastName } = user;
        const isActiveUser = id === activeUserId;
        const canActivateUser = !!(!activeUserId && onActivateUser);

        return (
          <div className={TaskAssignmentStyle} key={id}>
            <BooleanValue>
              {({ value: isHovered, set: changeHoverState }) => (
                <button
                  className={UserStyle(isActiveUser, editable && canActivateUser)}
                  onClick={evt => {
                    if (editable && canActivateUser) {
                      evt.stopPropagation();
                      if (onActivateUser) onActivateUser(user);
                    }
                  }}
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
                  type="button"
                >
                  {isHovered && canActivateUser && editable ? (
                    <div className={ConfirmIconWrapperStyle}>
                      <Icon icon="CONFIRM" />
                    </div>
                  ) : (
                    <UserAvatar firstName={firstName} lastName={lastName} />
                  )}
                </button>
              )}
            </BooleanValue>
            {editable && isActiveUser && (
              <button
                className={DeactivateButtonStyle}
                onClick={evt => {
                  evt.stopPropagation();
                  onDeactivateUser();
                }}
                type="button"
              >
                <Icon icon="CLEAR" />
              </button>
            )}
            {editable && !isActiveUser && (
              <button
                className={RemoveAssignmentButtonStyle}
                onClick={evt => {
                  evt.stopPropagation();
                  onChange(users.filter(({ id: userId }) => id !== userId));
                }}
                type="button"
              >
                <Icon icon="REMOVE" />
              </button>
            )}
          </div>
        );
      })}
      {editable && !activeUserId && users.length < MAX_USERS_ALLOWED && (
        <BooleanValue onChange={onToggleSlideView}>
          {({ value: isOpen, set: slideToggle }) => (
            <div role="presentation" onClick={evt => evt.stopPropagation()}>
              <button
                data-testid="addAssignerButton"
                className={AddAssignmentButtonStyle}
                type="button"
                onClick={evt => {
                  evt.stopPropagation();
                  slideToggle(true);
                }}
              >
                <Icon icon="ADD" />
              </button>
              <SlideView isOpen={isOpen} onRequestClose={() => slideToggle(false)}>
                {isOpen && (
                  <AssignUsers
                    selected={users}
                    onSelect={selected => {
                      slideToggle(false);
                      onChange(selected);
                    }}
                    onCancel={() => slideToggle(false)}
                    filterBy={{ groupIds }}
                  />
                )}
              </SlideView>
            </div>
          )}
        </BooleanValue>
      )}
    </div>
  );
};

TaskAssignmentInput.defaultProps = defaultProps;

export default TaskAssignmentInput;
