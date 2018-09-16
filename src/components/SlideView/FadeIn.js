// @flow
import * as React from 'react';
// $FlowFixMe: load direct from node module
import Transition from 'react-transition-group/Transition';
import LoadingIcon from 'components/LoadingIcon';

const duration = 300;

type Props = {
  in: boolean,
  children: React.Node,
};

const FadeIn = ({ in: inProp, children }: Props) => (
  <Transition in={inProp} timeout={duration}>
    {state => (['entering', 'exiting'].includes(state) ? <LoadingIcon /> : children)}
  </Transition>
);

export default FadeIn;
