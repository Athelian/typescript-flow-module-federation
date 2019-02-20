// @flow
import * as React from 'react';
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
} from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';
import emitter from 'utils/emitter';
import { useInChargeInput } from 'modules/form/hooks';

type OptionalProps = {
  max: number,
};

type Props = OptionalProps & {
  name: string,
  values: Array<Object>,
  id: string,
};

const defaultProps = {
  max: 5,
};

export default function InlineInChargeInput({ name, values, max, id: inputId }: Props) {
  const { isRemain, onChange } = useInChargeInput(values, { max });
  return (
    <div className={AssignmentWrapperStyle}>
      {values.map(({ id, firstName, lastName }) => (
        <div className={AssignmentStyle} key={id}>
          <button
            className={RemoveAssignmentButtonStyle}
            onClick={() => {
              onChange(values.filter(({ id: userId }) => id !== userId));
              emitter.emit('INLINE_CHANGE', {
                name,
                hasError: false,
                value: values.filter(({ id: userId }) => id !== userId),
              });
            }}
            type="button"
          >
            <Icon icon="REMOVE" />
          </button>
          <UserAvatar firstName={firstName} lastName={lastName} a11y={false} />
        </div>
      ))}
      {isRemain && (
        <BooleanValue>
          {({ value: isOpen, set: slideToggle }) => (
            <>
              <button
                id={`input-${inputId}`}
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
                      onChange(selected);
                      emitter.emit('INLINE_CHANGE', {
                        name,
                        hasError: false,
                        value: selected,
                      });
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
}

InlineInChargeInput.defaultProps = defaultProps;
