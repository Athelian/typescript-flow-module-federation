// @flow
import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import LoadingIcon from 'components/LoadingIcon';
import { LoadingWrapperStyle } from './style';

const duration = 300;

type Props = {
  in: boolean,
  children: React.Node,
};

const FadeIn = ({ in: inProp, children }: Props) => (
  <Transition in={inProp} timeout={duration}>
    {state =>
      ['entering', 'exiting'].includes(state) ? (
        <div className={LoadingWrapperStyle}>
          <LoadingIcon />
        </div>
      ) : (
        children
      )
    }
  </Transition>
);

export default FadeIn;
