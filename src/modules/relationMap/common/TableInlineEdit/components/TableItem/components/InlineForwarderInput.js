// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import SelectForwarders from 'modules/shipment/form/components/SelectForwarders';
import {
  AssignmentWrapperStyle,
  AssignmentStyle,
  RemoveAssignmentButtonStyle,
  AddAssignmentButtonStyle,
} from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';
import emitter from 'utils/emitter';
import { useInChargeInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

type OptionalProps = {
  max: number,
};

type Props = OptionalProps & {
  name: string,
  values: Array<Object>,
};

const defaultProps = {
  max: 4,
};

export default function InlineForwarderInput({ name, values, max }: Props) {
  const { isRemain, onChange } = useInChargeInput(values, { max });
  return (
    <div className={AssignmentWrapperStyle}>
      {values.map(({ id, name: forwarderName }) => (
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
          <span>{forwarderName}</span>
        </div>
      ))}
      {isRemain && (
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
                  <SelectForwarders
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

InlineForwarderInput.defaultProps = defaultProps;
