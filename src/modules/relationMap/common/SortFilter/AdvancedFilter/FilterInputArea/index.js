// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { FilterInputAreaWrapperStyle } from './style';

type Props = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
};

export default function FilterInputArea({ selectedEntityType, selectedFilterItem }: Props) {
  return (
    <div className={FilterInputAreaWrapperStyle}>
      {selectedEntityType} {selectedFilterItem}
    </div>
  );
}
