// @flow
import * as React from 'react';
import { RadioButtonWrapperStyle, RadioButtonStyle } from './style';

type Props = {
  selected: boolean,
  onToggle: Function,
  children: React.Node,
};

export default class RadioInput extends React.PureComponent<Props> {
  render() {
    const { selected, onToggle, children } = this.props;

    return (
      <div className={RadioButtonWrapperStyle(selected)} onClick={onToggle} role="presentation">
        <button className={RadioButtonStyle(selected)} type="button" />
        {children}
      </div>
    );
  }
}
