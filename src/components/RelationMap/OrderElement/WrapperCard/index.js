// @flow
import * as React from 'react';
import * as style from './style';

type OptionalProps = {
  fit: boolean,
};
type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  fit: false,
};
const WrapperCard = ({ children, fit, ...rest }: Props) => {
  return (
    <div role="presentation" className={style.OuterCardWrapperStyle(fit)} {...rest}>
      <div className={style.InnerCardWrapperStyle}>{children}</div>
    </div>
  );
};

WrapperCard.defaultProps = defaultProps;

export default WrapperCard;
