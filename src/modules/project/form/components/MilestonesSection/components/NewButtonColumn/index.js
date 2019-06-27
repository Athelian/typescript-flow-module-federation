// @flow
import * as React from 'react';
import { DashedPlusButton } from 'components/Form';
import { AddMilestoneButtonWrapperStyle } from './style';

type Props = {|
  onCreate: () => void,
|};

export default function NewButtonColumn({ onCreate }: Props) {
  return (
    <div className={AddMilestoneButtonWrapperStyle}>
      <DashedPlusButton width="195px" height="140px" onClick={onCreate} />
    </div>
  );
}
