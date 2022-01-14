// @flow
import * as React from 'react';
import { ArrayValue, ObjectValue } from 'react-values';
import { equals } from 'ramda';

type ItemProps = {|
  selectable: boolean,
  selected: boolean,
  onSelect: Object => void,
|};

type IncrementProps = {|
  value: number,
  onMinus: () => void,
  onPlus: () => void,
|};

type RenderProps<T> = {|
  value: T,
  dirty: boolean,
  getItemProps: (item: Object, selectable?: boolean) => ItemProps,
|};

type RenderWithIncrementProps<T> = {|
  ...RenderProps<T>,
  isAllSelected: boolean,
  onSelectAll: Function,
  getIncrementProps: (item: Object) => IncrementProps,
|};

type SingleProps = {|
  selected: ?Object,
  required?: boolean,
  children: (RenderProps<?Object>) => React.Node,
|};

type ManyProps = {|
  selected: Array<Object>,
  items?: Array<Object>, // queried items
  max?: number,
  onSelect?: Object => void,
  valueToSelected?: Object => boolean,
  children: (RenderWithIncrementProps<Array<Object>>) => React.Node,
|};

const countSelected = (selected: Array<Object> = [], value: Object) =>
  selected.filter(item => item.id === value.id).length;

const SelectorSingle = ({ selected, required, children }: SingleProps) => (
  <ObjectValue defaultValue={selected}>
    {({ value, set }) =>
      children({
        value,
        dirty: selected?.id !== value?.id,
        getItemProps: (item, selectable = true) => ({
          selectable,
          selected: value?.id === item.id || value?.partner?.id === item.id,
          onSelect: () => {
            if (item.id === value?.id) {
              if (!required) {
                set(null);
              }
            } else {
              set(item);
            }
          },
        }),
      })
    }
  </ObjectValue>
);

/**
 * Checks if all items in arr1 are in arr2
 */
const isAllSelected = (arr1: Object[], arr2: Object[]) => {
  const arr2ById = arr2.reduce((arr, item) => {
    // eslint-disable-next-line
    arr[item.id] = item;
    return arr;
  }, {});

  return !arr1.some(item => !arr2ById[item.id]);
};

const defaultArr = [];

const SelectorMany = ({
  selected,
  max,
  onSelect,
  items = defaultArr,
  valueToSelected,
  children,
}: ManyProps) => {
  const itemsById = React.useMemo(() => {
    return items.reduce((arr, item) => {
      // eslint-disable-next-line
      arr[item.id] = item;
      return arr;
    }, {});
  }, [items]);

  return (
    <ArrayValue defaultValue={selected}>
      {({ value, push, filter, set, splice }) => {
        return children({
          value,
          dirty: !equals(
            selected.map(i => i.id),
            value.map(i => i.id)
          ),
          isAllSelected: !!value.length && isAllSelected(items, value),
          onSelectAll: () => {
            if (value.length && isAllSelected(items, value)) {
              filter(i => !itemsById[i.id]);
            } else {
              set([...new Set(items.concat(value))]);
            }
          },
          getItemProps: (item, selectable = true) => {
            const isSelected = valueToSelected
              ? valueToSelected({ value, item })
              : value.some(i => i.id === item.id);
            return {
              selectable,
              selected: isSelected,
              onSelect: () => {
                if (onSelect) {
                  onSelect({ isSelected, filter, item, max, value, push });
                } else if (isSelected) {
                  filter(i => i.id !== item.id);
                } else if (!max || value.length < max) {
                  push(item);
                }
              },
            };
          },
          getIncrementProps: item => {
            const index = value.map(i => i.id).indexOf(item.id);

            return {
              value: countSelected(value, item),
              onMinus: () => {
                if (index > -1) {
                  splice(index, 1);
                }
              },
              onPlus: () => push(item),
            };
          },
        });
      }}
    </ArrayValue>
  );
};

export default {
  Single: SelectorSingle,
  Many: SelectorMany,
};
