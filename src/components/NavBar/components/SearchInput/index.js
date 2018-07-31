// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WrapperStyle, InputStyle, ClearButtonStyle } from './style';

type Props = {
  onChange: (value: string) => void,
};

type State = {
  query: string,
};

class SearchInput extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      query: '',
    };
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    const { query } = this.state;
    if (query !== nextState.query) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      const { onChange } = this.props;

      this.timeout = setTimeout(() => {
        onChange(query);
      }, 500);
    }
  }

  onChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const { value } = event.target;
    this.setState({ query: value });
  };

  clear = () => {
    this.setState({ query: '' });
  };

  timeout: ?TimeoutID;

  render() {
    const { query } = this.state;
    const hasContent = !!query;

    return (
      <div className={WrapperStyle}>
        <Icon icon="faSearch" />
        <input
          className={InputStyle}
          type="text"
          value={query}
          spellCheck={false}
          onChange={this.onChange}
        />
        {hasContent && (
          <button className={ClearButtonStyle} onClick={this.clear}>
            <Icon icon="faClear" />
          </button>
        )}
      </div>
    );
  }
}

export default SearchInput;
