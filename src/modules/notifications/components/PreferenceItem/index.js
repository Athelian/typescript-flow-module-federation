// @flow
import * as React from 'react';
import { CheckboxInput, Label } from 'components/Form';
import { PreferenceWrapperStyle, CheckboxWrapperStyle } from './style';

type Props = {|
  type: string,
  enabled: boolean,
  title: React$Node,
  onToggle: (type: string, enabled: boolean) => void,
|};

const PreferenceItem = ({ type, onToggle, enabled, title }: Props) => (
  <div className={PreferenceWrapperStyle}>
    <div className={CheckboxWrapperStyle}>
      <CheckboxInput
        checked={enabled}
        onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onToggle(type, !enabled);
        }}
      />
    </div>

    <Label height="30px">{title}</Label>
  </div>
);

export default PreferenceItem;
