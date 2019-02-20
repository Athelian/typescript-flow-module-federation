// @flow
import * as React from 'react';
import { RadioButtonWrapperStyle, RadioButtonStyle } from './style';

type OptionalProps = {
  onToggle: Function,
  editable: boolean,
};

type Props = OptionalProps & {
  selected: boolean,
  children: React.Node,
};

const defaultProps = {
  onToggle: () => {},
  editable: true,
};

export default class RadioInput extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { selected, onToggle, children, editable, ...rest } = this.props;

    return (
      <div
        className={RadioButtonWrapperStyle(selected, editable)}
        onClick={editable ? onToggle : () => {}}
        role="presentation"
      >
        <button className={RadioButtonStyle(editable)} type="button" {...rest} />
        {children}
      </div>
    );
  }
}
