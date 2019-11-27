// @flow
import * as React from 'react';
import { ArrayValue, ObjectValue } from 'react-values';
import { equals } from 'ramda';

type ItemProps = {|
  selectable: boolean,
  selected: boolean,
  onSelect: Object => void,
|};

type RenderProps<T> = {|
  value: T,
  dirty: boolean,
  getItemProps: (item: Object, selectable?: boolean) => ItemProps,
|};

type BaseProps<T> = {|
  selected: T,
  children: (RenderProps<T>) => React.Node,
|};

type SingleProps = {|
  ...BaseProps<?Object>,
  required?: boolean,
|};

const SelectorSingle = ({ selected, required, children }: SingleProps) => (
  <ObjectValue defaultValue={selected}>
    {({ value, set }) =>
      children({
        value,
        dirty: selected?.id !== value?.id,
        getItemProps: (item, selectable = true) => ({
          selectable,
          selected: value?.id === item.id,
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

type ManyProps = {|
  ...BaseProps<Array<Object>>,
  max?: number,
|};

const SelectorMany = ({ selected, max, children }: ManyProps) => (
  <ArrayValue defaultValue={selected}>
    {({ value, push, filter }) =>
      children({
        value,
        dirty: !equals(
          selected.map(i => i.id),
          value.map(i => i.id)
        ),
        getItemProps: (item, selectable = true) => {
          const isSelected = value.some(i => i.id === item.id);
          return {
            selectable,
            selected: isSelected,
            onSelect: () => {
              if (isSelected) {
                filter(i => i.id !== item.id);
              } else if (!max || value.length < max) {
                push(item);
              }
            },
          };
        },
      })
    }
  </ArrayValue>
);

export default {
  Single: SelectorSingle,
  Many: SelectorMany,
};
