// @flow
import * as React from 'react';
import { Label, ToggleInput } from 'components/Form';

type Props = {
  value: boolean,
  readonly: boolean,
  onChange: boolean => void,
};

const ArchivedFilterInput = ({ value, readonly, onChange }: Props) => {
  return (
    <>
      <Label height="30px" required>
        Archived
      </Label>

      <ToggleInput
        toggled={value}
        editable={!readonly}
        onToggle={() => {
          onChange(!value);
        }}
      />
    </>
  );
};

export default ArchivedFilterInput;
