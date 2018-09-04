// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TooltipBubble from './TooltipBubble';
import TooltipIcon from './TooltipIcon';
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './TooltipBubble/type';
import { TooltipRelativeWrapperStyle, BubbleWrapperStyle } from './style';

type OptionalProps = TooltipBubbleProps & {
  preShow: boolean,
  showDuration: number,
  isNew: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  ...defaultTooltipBubbleProps,
  preShow: false,
  showDuration: 1,
  isNew: false,
};

type State = {
  isShown: boolean,
};

export default class Tooltip extends React.Component<Props, State> {
  static defaultProps = defaultProps;

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
    const { errorMessage: prevError } = prevProps;
    const { errorMessage: currentError } = this.props;

    if (!isEquals(prevError, currentError)) {
      this.show();
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  getTooltipType = () => {
    const { errorMessage, warningMessage, infoMessage } = this.props;

    if (errorMessage) return 'error';
    if (warningMessage) return 'warning';
    if (this.showChanged()) return 'changed';
    if (infoMessage) return 'info';
    return '';
  };

  showChanged = () => {
    const {
      isNew,
      changedValues: { oldValue, newValue },
    } = this.props;

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
    const { errorMessage, warningMessage, infoMessage, changedValues, position } = this.props;
    const { isShown } = this.state;

    const type = this.getTooltipType();

    if (type) {
      return (
        <div className={TooltipRelativeWrapperStyle}>
          <div className={BubbleWrapperStyle(isShown)}>
            <TooltipBubble
              showChanged={this.showChanged()}
              errorMessage={errorMessage}
              warningMessage={warningMessage}
              infoMessage={infoMessage}
              changedValues={changedValues}
              position={position}
            />
          </div>
          <div
            onMouseOver={this.show}
            onFocus={this.show}
            onMouseOut={this.hide}
            onBlur={this.hide}
          >
            <TooltipIcon type={type} hasInfo={!!infoMessage} />
          </div>
        </div>
      );
    }
    return null;
  }
}
