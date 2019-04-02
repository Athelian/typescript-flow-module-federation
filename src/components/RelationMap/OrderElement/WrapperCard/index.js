// @flow
import * as React from 'react';
import { WrapperCardStyle } from './style';

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
    <div role="presentation" className={WrapperCardStyle(fit)} {...rest}>
      {children}
    </div>
  );
};

WrapperCard.defaultProps = defaultProps;

export default WrapperCard;
