// @flow
import * as React from 'react';
import * as style from './style';

type Props = {
  children: React.Node,
  onMouseEnter: Function,
  onMouseLeave: Function,
  onClick?: Function,
  onDoubleClick?: Function,
};

class WrapperCard extends React.PureComponent<Props> {
  render() {
    const { onMouseEnter, onMouseLeave, onClick, onDoubleClick, children } = this.props;
    return (
      <div
        role="presentation"
        className={style.OuterCardWrapperStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      >
        <div className={style.InnerCardWrapperStyle}>{children}</div>
      </div>
    );
  }
}

export default WrapperCard;
