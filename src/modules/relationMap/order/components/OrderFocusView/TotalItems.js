// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { TotalCard } from 'components/RelationMap';

type OptionalProps = {
  wrapperClassName?: string,
};

type Props = OptionalProps & {
  type: string,
  total: number,
  onToggle: () => void,
};

export default function TotalItems({ type, total, onToggle, wrapperClassName }: Props) {
  return (
    <div className={wrapperClassName} onClick={onToggle} role="presentation">
      <BaseCard>
        <TotalCard name={type} quantity={total} />
      </BaseCard>
    </div>
  );
}
