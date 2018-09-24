// @flow
import * as React from 'react';
import * as style from './style';

type Props = {
  children: React.Node,
  onMouseEnter: Function,
  onMouseLeave: Function,
  onClick?: Function,
};

class WrapperCard extends React.PureComponent<Props> {
  render() {
    const { onMouseEnter, onMouseLeave, onClick, children } = this.props;
    return (
      <div
        role="presentation"
        className={style.CardWrapperStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <div className={style.InnerCardWrapperStyle}>{children}</div>
      </div>
    );
  }
}

export default WrapperCard;
