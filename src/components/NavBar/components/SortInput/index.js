// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SelectInput } from 'components/Form/Inputs';
import {
  WrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionItemStyle,
} from './style';

type Sort = {
  title: string | React.Node,
  value: string,
};

type OptionalProps = {
  borderRound: boolean,
};

type Props = OptionalProps & {
  sort: Sort,
  ascending: boolean,
  fields: Array<{
    title: string | React.Node,
    value: string,
  }>,
  onChange: ({ field: Sort, ascending: boolean }) => void,
};

class SortInput extends React.Component<Props> {
  static defaultProps = {
    borderRound: true,
  };

  onFieldChange = (field: Sort) => {
    const { onChange } = this.props;
    onChange({ field, ascending: false });
  };

  onAscClick = (e: any) => {
    e.stopPropagation();
    const { ascending, sort, onChange } = this.props;
    onChange({ field: sort, ascending: !ascending });
  };

  render() {
    const { sort, ascending, fields, borderRound } = this.props;
    const itemToString = item => (item ? item.title : '');
    const itemToValue = item => (item ? item.value : '');

    return (
      <SelectInput
        name="sort"
        value={sort.value}
        items={fields}
        itemToString={itemToString}
        itemToValue={itemToValue}
        onChange={this.onFieldChange}
        renderSelect={({ toggle, selectedItem, getInputProps }) => (
          <div className={WrapperStyle(borderRound)}>
            <input
              readOnly
              spellCheck={false}
              className={InputStyle}
              onClick={toggle}
              {...getInputProps({
                value: itemToString(selectedItem),
              })}
            />
            <button type="button" className={ButtonStyle} onClick={this.onAscClick}>
              <Icon icon={ascending ? 'SORT_ASC' : 'SORT_DESC'} />
            </button>
          </div>
        )}
        renderOptions={({ highlightedIndex, selectedItem, getItemProps }) => (
          <div className={OptionWrapperStyle}>
            {fields.map((item, index) => (
              <div
                key={itemToValue(item)}
                className={OptionItemStyle(
                  highlightedIndex === index,
                  itemToValue(selectedItem) === itemToValue(item)
                )}
                {...getItemProps({ item })}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      />
    );
  }
}

export default SortInput;
