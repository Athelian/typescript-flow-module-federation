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
  getIncrementProps: (item: Object) => IncrementProps,
|};

type SingleProps = {|
  selected: ?Object,
  required?: boolean,
  children: (RenderProps<?Object>) => React.Node,
|};

type ManyProps = {|
  selected: Array<Object>,
  max?: number,
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

const SelectorMany = ({ selected, max, children }: ManyProps) => (
  <ArrayValue defaultValue={selected}>
    {({ value, push, filter, splice }) =>
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
      })
    }
  </ArrayValue>
);

export default {
  Single: SelectorSingle,
  Many: SelectorMany,
};
