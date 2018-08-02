// @flow
import * as React from 'react';

type Props = {
  style: any,
  searchIcon: React.Node,
  clearButton: ({ clearQuery: () => void }) => React.Node,
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
    const { searchIcon, clearButton, style } = this.props;
    const hasContent = !!query;

    return (
      <div className={style}>
        {searchIcon && searchIcon}
        <input type="text" value={query} spellCheck={false} onChange={this.onChange} />
        {hasContent && clearButton && clearButton({ clearQuery: this.clear })}
      </div>
    );
  }
}

export default SearchInput;
