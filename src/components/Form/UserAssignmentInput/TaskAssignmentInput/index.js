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
} from './style';

type OptionalProps = {
  users: Array<UserAvatarType>,
  activeUserId: ?string,
  onChange: (values: Array<UserAvatarType>) => void,
  onActivateUser: UserAvatarType => void,
  onDeactivateUser: () => void,
  editable: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  users: [],
  onChange: () => {},
  onActivateUser: () => {},
  onDeactivateUser: () => {},
  editable: false,
};

const TaskAssignmentInput = ({
  users,
  activeUserId,
  onChange,
  onActivateUser,
  onDeactivateUser,
  editable,
}: Props) => {
  return (
    <div className={TaskAssignmentWrapperStyle}>
      {users.map(user => {
        const { id, firstName, lastName } = user;
        const isActiveUser = id === activeUserId;
        const canActivateUser = !activeUserId;

        return (
          <div className={TaskAssignmentStyle} key={id}>
            <button
              className={UserStyle(isActiveUser, editable && canActivateUser)}
              onClick={() => {
                if (editable && canActivateUser) {
                  onActivateUser(user);
                }
              }}
              type="button"
            >
              <UserAvatar firstName={firstName} lastName={lastName} />
            </button>
            {editable && isActiveUser && (
              <button className={DeactivateButtonStyle} onClick={onDeactivateUser} type="button">
                <Icon icon="CLEAR" />
              </button>
            )}
            {editable && !isActiveUser && (
              <button
                className={RemoveAssignmentButtonStyle}
                onClick={() => onChange(users.filter(({ id: userId }) => id !== userId))}
                type="button"
              >
                <Icon icon="REMOVE" />
              </button>
            )}
          </div>
        );
      })}
      {editable && !activeUserId && users.length < MAX_USERS_ALLOWED && (
        <BooleanValue>
          {({ value: isOpen, set: slideToggle }) => (
            <>
              <button
                data-testid="addAssignerButton"
                className={AddAssignmentButtonStyle}
                type="button"
                onClick={() => slideToggle(true)}
              >
                <Icon icon="ADD" />
              </button>
              <SlideView
                isOpen={isOpen}
                onRequestClose={() => slideToggle(false)}
                options={{ width: '1030px' }}
              >
                {isOpen && (
                  <AssignUsers
                    selected={users}
                    onSelect={selected => {
                      slideToggle(false);
                      onChange(selected);
                    }}
                    onCancel={() => slideToggle(false)}
                  />
                )}
              </SlideView>
            </>
          )}
        </BooleanValue>
      )}
    </div>
  );
};

TaskAssignmentInput.defaultProps = defaultProps;

export default TaskAssignmentInput;
