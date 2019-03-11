// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import { type UserAvatarType } from 'types';
import AssignUsers from './components/AssignUsers';
import { MAX_USERS_ALLOWED } from './constants';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from './style';

type OptionalProps = {
  users: Array<UserAvatarType>,
  name: string,
  onChange: (name: string, users: Array<UserAvatarType>) => void,
  editable: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  users: [],
  name: '',
  onChange: () => {},
  editable: false,
};

const UserAssignmentInput = ({ users, name, onChange, editable }: Props) => (
  <div className={AssignmentWrapperStyle}>
    {users.map(({ id, firstName, lastName }) => (
      <div className={AssignmentStyle} key={id}>
        <UserAvatar firstName={firstName} lastName={lastName} />
        {editable && (
          <button
            className={RemoveAssignmentButtonStyle}
            onClick={() => onChange(name, users.filter(({ id: userId }) => id !== userId))}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
        )}
      </div>
    ))}
    {editable && users.length < MAX_USERS_ALLOWED && (
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
                    onChange(name, selected);
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

UserAssignmentInput.defaultProps = defaultProps;

export default UserAssignmentInput;
