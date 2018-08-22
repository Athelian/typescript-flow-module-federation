// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TooltipBubble from './TooltipBubble';
import TooltipIcon from './TooltipIcon';
import type { TooltipBubbleProps } from './TooltipBubble/type';
import type { TooltipIconProps } from './TooltipIcon/type.js.flow';
import { TooltipWrapperStyle, BubbleWrapperStyle } from './style';

type Props = TooltipBubbleProps &
  TooltipIconProps & {
    preShow?: boolean,
    showDuration?: number,
  };

type State = {
  isShown: boolean,
};

export default class Tooltip extends React.Component<Props, State> {
  static defaultProps = {
    preShow: false,
    showDuration: 500,
  };

  state = {
    isShown: false,
  };

  componentDidMount() {
    const { preShow } = this.props;

    if (preShow) {
      this.show();
      this.startTimeout();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEquals(prevProps, this.props)) {
      this.show();
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  getTooltipType = ({ errorMessage, warningMessage, changedValues }: TooltipBubbleProps) => {
    if (errorMessage) return 'error';
    if (warningMessage) return 'warning';
    if (changedValues) return 'changed';
    return 'info';
  };

  show = () => {
    this.clearTimeout();
    this.setState({ isShown: true });
  };

  hide = () => {
    this.startTimeout();
  };

  startTimeout = () => {
    const { showDuration } = this.props;

    this.timeout = setTimeout(() => this.finishTimeout(), showDuration);
  };

  finishTimeout = () => {
    this.setState({ isShown: false });
    this.timeout = null;
  };

  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  timeout: ?TimeoutID;

  render() {
    const { infoMessage, ...rest } = this.props;
    const { errorMessage, warningMessage, changedValues } = rest;
    const tooltipMessage = { errorMessage, warningMessage, changedValues };
    const type = this.getTooltipType(tooltipMessage);
    const { isShown } = this.state;
    return (
      <div className={TooltipWrapperStyle}>
        <div className={BubbleWrapperStyle(isShown)}>
          <TooltipBubble infoMessage={infoMessage} {...rest} />
        </div>
        <div onMouseOver={this.show} onFocus={this.show} onMouseOut={this.hide} onBlur={this.hide}>
          <TooltipIcon type={type} hasInfo={!!infoMessage} />
        </div>
      </div>
    );
  }
}
