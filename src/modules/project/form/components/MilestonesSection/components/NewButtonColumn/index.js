// @flow
import * as React from 'react';
import { DashedPlusButton } from 'components/Form';
import { ContainerStyle } from './style';

type Props = {|
  onCreate: () => void,
|};

export default function NewButtonColumn({ onCreate }: Props) {
  return (
    <div className={ContainerStyle}>
      <DashedPlusButton width="195px" height="215px" onClick={onCreate} />
    </div>
  );
}
