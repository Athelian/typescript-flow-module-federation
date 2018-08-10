// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SelectInput as StyleLessSelectInput } from 'components/base';
import {
  WrapperStyle,
  ButtonStyle,
  OptionWrapperStyle,
  SelectStyle,
  OptionItemStyle,
} from './style';

type Sort = {
  title: string,
  value: string,
};

type Props = {
  sort: Sort,
  ascending: boolean,
  fields: Array<{
    title: string | React.Node,
    value: string,
  }>,
  onChange: ({ field: Sort, ascending: boolean }) => void,
};

class SortInput extends React.Component<Props> {
  onFieldChange = (field: Sort) => {
    const { onChange } = this.props;
    onChange({ field, ascending: false });
  };

  onAscClick = (e: any) => {
    e.stopPropagation();
    const { ascending, sort, onChange } = this.props;
    onChange({ field: sort, ascending: !ascending });
  };

  optionItem = ({
    value,
    onHover,
    selected,
  }: {
    // type is used for args
    /* eslint-disable react/no-unused-prop-types */
    value: Sort,
    onHover: boolean,
    selected: boolean,
  }) => <div className={OptionItemStyle(onHover, selected)}>{value.title}</div>;

  render() {
    const { sort, ascending, fields } = this.props;

    return (
      <StyleLessSelectInput
        items={fields}
        itemToString={item => (item ? item.value : '')}
        itemToValue={item => (item ? item.value : '')}
        renderSelect={() => (
          <div className={WrapperStyle}>
            <div className={SelectStyle}>{sort.title}</div>
            <button type="button" className={ButtonStyle} onClick={this.onAscClick}>
              <Icon icon={ascending ? 'SORT_ASC' : 'SORT_DESC'} />
            </button>
          </div>
        )}
        renderOption={this.optionItem}
        onChange={this.onFieldChange}
        styles={{ select: '', options: OptionWrapperStyle }}
      />
    );
  }
}

export default SortInput;
