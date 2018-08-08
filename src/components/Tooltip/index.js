// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import { TooltipWrapperStyle, TooltipBoxStyle, TooltipArrowStyle } from './style';
import TooltipMessage from './TooltipMessage';

const colorMap = {
  info: colors.GRAY_DARK,
  edited: colors.TEAL_DARK,
  warning: colors.YELLOW_DARK,
  error: colors.RED_DARK,
};

type TooltipEnumType = 'info' | 'edited' | 'warning' | 'error';
const getColorFromType = (type: TooltipEnumType) => {
  const color = colorMap[type];
  return color == null ? colors.GRAY_DARK : color;
};

type Props = {
  title: React.Node,
  type: TooltipEnumType,
  children: React.Node,
};
type State = {
  hover: boolean,
};

class Tooltip extends React.Component<Props, State> {
  static Message = TooltipMessage;

  state = { hover: false };

  toggle = () => {
    this.setState(({ hover }) => ({ hover: !hover }));
  };

  render() {
    const { hover } = this.state;
    const { title, type, children } = this.props;
    const color = getColorFromType(type);
    return (
      <div
        className={TooltipWrapperStyle}
        onMouseOver={this.toggle}
        onMouseOut={this.toggle}
        onFocus={this.toggle}
        onBlur={this.toggle}
      >
        {children}
        <div className={TooltipArrowStyle({ hover, color })} />
        <div className={TooltipBoxStyle({ hover, color })}>{title}</div>
      </div>
    );
  }
}

export default Tooltip;
