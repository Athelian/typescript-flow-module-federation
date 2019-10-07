// @flow
import * as React from 'react';
import { WrapperStyle } from './style';

type Props = {
  focus: boolean,
  preselect: boolean,
  children: ({ ref: { current: HTMLInputElement | null } }) => React.Node,
};

const InputWrapper = ({ focus, preselect, children }: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const input = inputRef.current;

    if (focus) {
      // $FlowIssue: Flow doesn't know focus options
      input.focus({
        preventScroll: true,
      });

      if (preselect) {
        input.select();
      }
    } else {
      input.blur();
    }
  }, [focus, preselect]);

  return <div className={WrapperStyle}>{children({ ref: inputRef })}</div>;
};

InputWrapper.defaultProps = {
  preselect: false,
};

export default InputWrapper;
