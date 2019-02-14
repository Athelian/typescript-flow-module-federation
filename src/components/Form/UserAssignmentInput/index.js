// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import AssignUsers from './AssignUsers';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from './style';

const MAX_USERS_ALLOWED = 5;

export type User = {
  id: string,
  firstName: string,
  lastName: string,
};

type OptionalProps = {
  values: Array<User>,
  name: string,
  onChange: (name: string, values: Array<User>) => void,
  editable: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  values: [],
  name: '',
  onChange: () => {},
  editable: true,
};

const UserAssignmentInput = ({ values, name, onChange, editable }: Props) => {
  return (
    <div className={AssignmentWrapperStyle}>
      {values &&
        values.map(({ id, firstName, lastName }) => (
          <div className={AssignmentStyle} key={id}>
            {editable && (
              <button
                className={RemoveAssignmentButtonStyle}
                onClick={() => onChange(name, values.filter(({ id: userId }) => id !== userId))}
                type="button"
              >
                <Icon icon="REMOVE" />
              </button>
            )}
            <UserAvatar firstName={firstName} lastName={lastName} />
          </div>
        ))}
      {editable && values && values.length < MAX_USERS_ALLOWED && (
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
                    selected={values}
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
};

UserAssignmentInput.defaultProps = defaultProps;

export default UserAssignmentInput;
