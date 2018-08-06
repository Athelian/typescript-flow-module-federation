// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WrapperStyle, TooltipStyle, IconStyle } from './style';

type Props = {
  value: string | React.Node,
  icon: Object,
  preShow: boolean,
  showDuration: number,
  tooltipStyle?: Object,
  iconStyle?: Object,
};

type State = {
  isShown: boolean,
};

export default class Tooltip extends React.Component<Props, State> {
  static defaultProps = {
    tooltipStyle: {},
    iconStyle: {},
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
    const { value } = this.props;
    if (!isEquals(prevProps.value, value)) {
      this.show();
      this.startTimeout();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

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
    const { value, icon, tooltipStyle, iconStyle } = this.props;
    const { isShown } = this.state;
    return (
      <div className={WrapperStyle}>
        <div
          className={TooltipStyle(tooltipStyle, isShown)}
          onMouseOver={this.show}
          onFocus={this.show}
          onMouseOut={this.hide}
          onBlur={this.hide}
        >
          {value}
        </div>
        <div
          onMouseOver={this.show}
          onFocus={this.show}
          onMouseOut={this.hide}
          onBlur={this.hide}
          className={IconStyle(iconStyle)}
        >
          <FontAwesomeIcon icon={icon} fixedWidth />
        </div>
      </div>
    );
  }
}
