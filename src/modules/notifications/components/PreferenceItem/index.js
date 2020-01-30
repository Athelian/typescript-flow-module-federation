// @flow
import * as React from 'react';
import { CheckboxInput, Label } from 'components/Form';
import { PreferenceWrapperStyle, CheckboxWrapperStyle } from './style';

type Props = {|
  column: string,
  title: React$Node,
  selected: boolean,
  onToggle: (selectedKey: string) => void,
|};

const PreferenceItem = ({ column, onToggle, selected, title }: Props) => (
  <div className={PreferenceWrapperStyle}>
    <div className={CheckboxWrapperStyle}>
      <CheckboxInput
        checked={selected}
        onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onToggle(column);
        }}
      />
    </div>

    <Label height="30px">{title}</Label>
  </div>
);

export default PreferenceItem;
