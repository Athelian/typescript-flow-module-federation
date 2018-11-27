// @flow
import * as React from 'react';
import { RadioButtonWrapperStyle, RadioButtonStyle } from './style';

type OptionalProps = {
  onToggle: Function,
};

type Props = OptionalProps & {
  selected: boolean,
  children: React.Node,
};

const defaultProps = {
  onToggle: () => {},
};

export default class RadioInput extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { selected, onToggle, children, ...rest } = this.props;

    return (
      <div className={RadioButtonWrapperStyle(selected)} onClick={onToggle} role="presentation">
        <button className={RadioButtonStyle(selected)} type="button" {...rest} />
        {children}
      </div>
    );
  }
}
