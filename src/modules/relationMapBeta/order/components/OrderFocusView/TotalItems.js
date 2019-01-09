// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { WrapperCard, TotalCard } from 'components/RelationMap';

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
    <BaseCard wrapperClassName={wrapperClassName}>
      <WrapperCard onClick={onToggle}>
        <TotalCard name={type} quantity={total} />
      </WrapperCard>
    </BaseCard>
  );
}
