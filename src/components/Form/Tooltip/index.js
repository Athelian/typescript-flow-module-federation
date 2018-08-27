// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TooltipBubble from './TooltipBubble';
import TooltipIcon from './TooltipIcon';
import { type TooltipProps as Props, defaultTooltipProps } from './type';
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './TooltipBubble/type';
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
    const {
      tooltipBubbleOptions: { errorMessage: prevError },
    } = prevProps;
    const {
      tooltipBubbleOptions: { errorMessage: currentError },
    } = this.props;

    if (!isEquals(prevError, currentError)) {
      this.show();
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  getTooltipType = (mergedTooltipBubbleOptions: TooltipBubbleProps) => {
    const { errorMessage, warningMessage, infoMessage } = mergedTooltipBubbleOptions;

    if (errorMessage) return 'error';
    if (warningMessage) return 'warning';
    if (this.showChanged(mergedTooltipBubbleOptions)) return 'changed';
    if (infoMessage) return 'info';
    return '';
  };

  showChanged = (mergedTooltipBubbleOptions: TooltipBubbleProps) => {
    const { isNew } = this.props;
    const {
      changedValues: { oldValue, newValue },
    } = mergedTooltipBubbleOptions;

    const showChanged = !isNew && (!!oldValue || !!newValue) && !isEquals(oldValue, newValue);

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
    const { tooltipBubbleOptions } = this.props;
    const { isShown } = this.state;
    const mergedTooltipBubbleOptions = { ...defaultTooltipBubbleProps, ...tooltipBubbleOptions };

    const type = this.getTooltipType(mergedTooltipBubbleOptions);

    if (type) {
      return (
        <div className={TooltipAbsoluteWrapperStyle}>
          <div className={TooltipRelativeWrapperStyle}>
            <div className={BubbleWrapperStyle(isShown)}>
              <TooltipBubble
                showChanged={this.showChanged(mergedTooltipBubbleOptions)}
                {...mergedTooltipBubbleOptions}
              />
            </div>
            <div
              onMouseOver={this.show}
              onFocus={this.show}
              onMouseOut={this.hide}
              onBlur={this.hide}
            >
              <TooltipIcon type={type} hasInfo={!!tooltipBubbleOptions.infoMessage} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

Tooltip.defaultProps = defaultTooltipProps;
