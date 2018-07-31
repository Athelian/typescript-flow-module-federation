// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PureSelectInput from 'components/PureSelectInput';
import { WrapperStyle, ButtonStyle, OptionWrapperStyle, InputStyle, ItemStyle } from './style';

type Props = {
  sort: { title: string, value: string },
  ascending: boolean,
  fields: Array<{
    title: string | React.Node,
    value: string,
  }>,
  onChange: ({ field: { title: string, value: string }, ascending: boolean }) => void,
};

class SortInput extends React.Component<Props> {
  onFieldChange = (field: { title: string, value: string }) => {
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
    isActive,
    selected,
  }: {
    // type is used for args
    /* eslint-disable react/no-unused-prop-types */
    value: { title: string, value: string },
    isActive: boolean,
    selected: boolean,
  }) => <div className={ItemStyle(isActive, selected)}>{value.title}</div>;

  render() {
    const { sort, ascending, fields } = this.props;

    return (
      <PureSelectInput
        value={sort}
        items={fields}
        itemToString={item => (item ? item.title : '')}
        itemToValue={item => (item ? item.value : '')}
        renderItem={this.optionItem}
        optionWrapperStyle={OptionWrapperStyle}
        onChange={this.onFieldChange}
      >
        <div className={WrapperStyle}>
          <div className={InputStyle}>{sort.title}</div>
          <button className={ButtonStyle} onClick={this.onAscClick}>
            <Icon icon={ascending ? 'faSortAsc' : 'faSortDesc'} />
          </button>
        </div>
      </PureSelectInput>
    );
  }
}

export default SortInput;
