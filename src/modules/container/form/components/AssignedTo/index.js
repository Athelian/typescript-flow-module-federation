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
  setDeepFieldValue: Function,
  onRemoveAssignTo: Function,
};

const defaultProps = {
  setDeepFieldValue: () => {},
  onRemoveAssignTo: () => {},
};

const AssignedTo = ({ assignedTo, setDeepFieldValue, onRemoveAssignTo }: Props) => (
  <div className={AssignmentWrapperStyle}>
    {assignedTo &&
      assignedTo.map(({ id, firstName, lastName }, index) => (
        <div className={AssignmentStyle} key={id}>
          <button
            className={RemoveAssignmentButtonStyle}
            onClick={() => onRemoveAssignTo(index)}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
          <UserAvatar firstName={firstName} lastName={lastName} />
        </div>
      ))}
    {(assignedTo || (assignedTo && assignedTo.length < 5)) && (
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
                  onSelect={selected => {
                    slideToggle(false);
                    setDeepFieldValue(`assignedTo`, selected);
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

AssignedTo.defaultProps = defaultProps;

export default AssignedTo;
