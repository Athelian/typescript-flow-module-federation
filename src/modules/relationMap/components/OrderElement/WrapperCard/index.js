// @flow
import * as React from 'react';
import * as style from './style';

type OptionalProps = {
  onMouseEnter?: Function,
  onMouseLeave?: Function,
  onClick?: Function,
  onDoubleClick?: Function,
};
type Props = OptionalProps & {
  children: React.Node,
};

class WrapperCard extends React.PureComponent<Props> {
  constructor() {
    super();
    this.clickTimeout = null;
  }

  clearClickTimeout = () => {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
  };

  handleClicks = () => {
    const { onClick, onDoubleClick } = this.props;
    if (this.clickTimeout !== null) {
      if (onDoubleClick) {
        onDoubleClick();
      }
      this.clearClickTimeout();
    } else {
      this.clickTimeout = setTimeout(() => {
        if (onClick) {
          onClick();
        }
        this.clearClickTimeout();
      }, 200);
    }
  };

  clickTimeout: ?TimeoutID;

  render() {
    const { onMouseEnter, onMouseLeave, children } = this.props;
    return (
      <div
        role="presentation"
        className={style.OuterCardWrapperStyle}
        onClick={this.handleClicks}
        {...(onMouseEnter ? { onMouseEnter } : {})}
        {...(onMouseLeave ? { onMouseLeave } : {})}
      >
        <div className={style.InnerCardWrapperStyle}>{children}</div>
      </div>
    );
  }
}

export default WrapperCard;
