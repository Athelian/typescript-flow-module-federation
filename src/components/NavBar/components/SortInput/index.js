// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WrapperStyle, ButtonStyle, InputStyle } from './style';

type Props = {
  sort: string,
  ascending: boolean,
  fields: Array<{
    title: string | React.Node,
    value: string,
  }>,
  onChange: ({ field: string, ascending: boolean }) => void,
};

class SortInput extends React.Component<Props> {
  onFieldChange = (event: Event) => {
    const { onChange } = this.props;

    if (event.target instanceof HTMLSelectElement) {
      onChange({ field: event.target.value, ascending: false });
    }
  };

  onAscClick = () => {
    const { ascending, sort, onChange } = this.props;

    onChange({ field: sort, ascending: !ascending });
  };

  render() {
    const { sort, ascending, fields } = this.props;

    return (
      <div className={WrapperStyle}>
        <select value={sort} className={InputStyle} onChange={this.onFieldChange}>
          {fields.map(field => (
            <option value={field.value} key={field.value}>
              {field.title}
            </option>
          ))}
        </select>
        <button className={ButtonStyle} onClick={this.onAscClick}>
          <Icon icon={ascending ? 'faSortAsc' : 'faSortDesc'} />
        </button>
      </div>
    );
  }
}

export default SortInput;
