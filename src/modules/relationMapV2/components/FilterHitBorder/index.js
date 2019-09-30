// @flow
import * as React from 'react';
import { FilteredHitStyle } from './style';

type Props = {|
  hasFilterHits: boolean,
|};

export default function FilterHitBorder({ hasFilterHits }: Props) {
  return <div className={FilteredHitStyle(hasFilterHits)} />;
}
