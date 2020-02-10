// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import emitter from 'utils/emitter';

type Props = {|
  to: string,
  href?: string,
  className?: string,
  children: React$Node,
  onClick?: Event => void,
|};

function NavigateLink({ to, className, children, href, onClick }: Props) {
  const handleClick = evt => {
    if (!evt.ctrlKey && !evt.shiftKey) {
      evt.preventDefault();
      emitter.emit('NAVIGATE_TO', to);
    }
  };
  return (
    // $FlowFixMe Flow typed is not updated yet
    <Link
      to={to}
      href={href}
      className={className}
      onClick={evt => {
        handleClick(evt);
        if (onClick) onClick(evt);
      }}
    >
      {children}
    </Link>
  );
}

export default NavigateLink;
