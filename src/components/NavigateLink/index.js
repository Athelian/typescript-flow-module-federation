// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import emitter from 'utils/emitter';

type Props = {|
  to: string,
  className: string,
  children: React$Node,
|};

function NavigateLink({ to, className, children }: Props) {
  const onClick = evt => {
    evt.preventDefault();
    emitter.emit('NAVIGATE_TO', to);
  };
  return (
    // $FlowFixMe Flow typed is not updated yet
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export default NavigateLink;
