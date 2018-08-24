// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TooltipBubble from './TooltipBubble';
import TooltipIcon from './TooltipIcon';
import { type TooltipProps as Props, defaultTooltipProps } from './type';
import {
  TooltipAbsoluteWrapperStyle,
  TooltipRelativeWrapperStyle,
  BubbleWrapperStyle,
} from './style';

type State = {
  isShown: boolean,
};

export default class Tooltip extends React.Component<Props, State> {
  static defaultProps = defaultTooltipProps;

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

  getTooltipType = () => {
    const { tooltipBubbleProps } = this.props;
    const { errorMessage, warningMessage, infoMessage } = tooltipBubbleProps;

    if (errorMessage) return 'error';
    if (warningMessage) return 'warning';
    if (this.showChanged()) return 'changed';
    if (infoMessage) return 'info';
    return '';
  };

  showChanged = () => {
    const { isNew, tooltipBubbleProps } = this.props;
    const { changedValues } = tooltipBubbleProps;
    const { oldValue, newValue } = changedValues;

    const showChanged = !!(
      !isNew &&
      (!oldValue ? !!newValue : true) &&
      !isEquals(oldValue, newValue)
    );

    return showChanged;
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
    const { tooltipBubbleProps } = this.props;
    const { isShown } = this.state;

    const type = this.getTooltipType();

    if (type) {
      return (
        <div className={TooltipAbsoluteWrapperStyle}>
          <div className={TooltipRelativeWrapperStyle}>
            <div className={BubbleWrapperStyle(isShown)}>
              <TooltipBubble showChanged={this.showChanged()} {...tooltipBubbleProps} />
            </div>
            <div
              onMouseOver={this.show}
              onFocus={this.show}
              onMouseOut={this.hide}
              onBlur={this.hide}
            >
              <TooltipIcon type={type} hasInfo={!!tooltipBubbleProps.infoMessage} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

Tooltip.defaultProps = defaultTooltipProps;
