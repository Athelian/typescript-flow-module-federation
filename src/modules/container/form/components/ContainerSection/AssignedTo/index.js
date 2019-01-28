// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import AssignUsers from 'modules/shipment/form/components/TimelineSection/components/AssignUsers';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from './style';

type Props = {
  assignedTo: any,
  setFieldValue: Function,
  field: string,
};

const removeAssignmentByIndex = (assignedTo: Array<Object>, index: number) => {
  const assigns = [...assignedTo];
  assigns.splice(index, 1);
  return assigns;
};

const AssignedTo = ({ assignedTo, setFieldValue, field }: Props) => (
  <div className={AssignmentWrapperStyle}>
    {assignedTo &&
      assignedTo.map(({ id, firstName, lastName }, index) => (
        <div className={AssignmentStyle} key={id}>
          <button
            className={RemoveAssignmentButtonStyle}
            onClick={() => {
              const users = removeAssignmentByIndex(assignedTo, index);
              setFieldValue(field, users);
            }}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
          <UserAvatar firstName={firstName} lastName={lastName} />
        </div>
      ))}
    {(!assignedTo || (assignedTo && assignedTo.length < 5)) && (
      <BooleanValue>
        {({ value: isOpen, set: slideToggle }) => (
          <>
            <button
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
                  selected={assignedTo}
                  onSelect={users => {
                    slideToggle(false);
                    setFieldValue(field, users);
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

export default AssignedTo;
