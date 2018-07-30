// @flow
import * as React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSortDesc from '@fortawesome/fontawesome-pro-solid/faSortAmountDown';
import faSortAsc from '@fortawesome/fontawesome-pro-solid/faSortAmountUp';
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

type State = {
  focus: boolean,
};

class SortInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      focus: false,
    };
  }

  onFocus = () => {
    this.setState({ focus: true });
  };

  onUnFocus = () => {
    this.setState({ focus: false });
  };

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

  select: ?HTMLSelectElement;

  render() {
    const { sort, ascending, fields } = this.props;
    const { focus } = this.state;

    return (
      <div className={WrapperStyle(focus)}>
        <select
          value={sort}
          onFocus={this.onFocus}
          onBlur={this.onUnFocus}
          className={InputStyle}
          onChange={this.onFieldChange}
        >
          {fields.map(field => (
            <option value={field.value} key={field.value}>
              {field.title}
            </option>
          ))}
        </select>
        <button
          className={ButtonStyle}
          onFocus={this.onFocus}
          onBlur={this.onUnFocus}
          onClick={this.onAscClick}
        >
          <FontAwesomeIcon icon={ascending ? faSortAsc : faSortDesc} fixedWidth />
        </button>
      </div>
    );
  }
}

export default SortInput;
