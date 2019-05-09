// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import emitter from 'utils/emitter';

type OptionalProps = {
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  toggled: boolean,
  id: string,
};

const defaultProps = {
  disabled: false,
};

export default function InlineToggleButton({ name, toggled, id, disabled }: Props) {
  return (
    <ToggleInput
      editable={!disabled}
      id={`input-${id}`}
      toggled={toggled}
      onToggle={() => {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value: !toggled,
        });
      }}
    />
  );
}

InlineToggleButton.defaultProps = defaultProps;
