// @flow
import * as React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-pro-regular/faSearch';
import faClear from '@fortawesome/fontawesome-pro-regular/faTimes';
import { WrapperStyle, InputStyle, ClearButtonStyle } from './style';

type Props = {
  onChange: (value: string) => void,
  stayExpanded?: boolean,
};

type State = {
  focus: boolean,
  query: string,
};

class SearchInput extends React.Component<Props, State> {
  static defaultProps = {
    stayExpanded: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      focus: false,
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

  onFocus = () => {
    this.setState({ focus: true });
  };

  onUnFocus = () => {
    this.setState({ focus: false });
  };

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
    const { stayExpanded } = this.props;
    const { focus, query } = this.state;
    const hasContent = !!query;

    return (
      <div className={WrapperStyle(focus, !!hasContent || !!stayExpanded)}>
        <FontAwesomeIcon icon={faSearch} fixedWidth />
        <input
          className={InputStyle}
          type="text"
          value={query}
          spellCheck={false}
          onFocus={this.onFocus}
          onBlur={this.onUnFocus}
          onChange={this.onChange}
        />
        {hasContent && (
          <button className={ClearButtonStyle} onClick={this.clear}>
            <FontAwesomeIcon icon={faClear} fixedWidth />
          </button>
        )}
      </div>
    );
  }
}

export default SearchInput;
