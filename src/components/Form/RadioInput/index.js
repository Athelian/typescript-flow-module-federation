// @flow
import * as React from 'react';
import { RadioButtonWrapperStyle, RadioButtonStyle } from './style';

type OptionalProps = {
  onToggle: Function,
  editable: boolean,
  align: 'left' | 'right',
};

type Props = OptionalProps & {
  selected: boolean,
  children: React.Node,
};

const defaultProps = {
  onToggle: () => {},
  editable: true,
  align: 'left',
};

const RadioInput = ({ align, selected, onToggle, children, editable, ...rest }: Props) => {
  return (
    <div
      className={RadioButtonWrapperStyle(selected, editable)}
      onClick={editable ? onToggle : () => {}}
      role="presentation"
    >
      {align === 'left' ? (
        <>
          <button className={RadioButtonStyle(editable)} type="button" {...rest} />
          {children}
        </>
      ) : (
        <>
          {children}
          <button className={RadioButtonStyle(editable)} type="button" {...rest} />
        </>
      )}
    </div>
  );
};

RadioInput.defaultProps = defaultProps;

export default RadioInput;
