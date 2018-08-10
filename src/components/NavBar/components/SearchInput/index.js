// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SearchInput as StyleLessSearchInput } from 'components/base';
import { SearchInputStyle } from './style';

type Props = {
  onChange: Function,
  onBlur?: Function,
  onClear: Function,
  name: string,
  value: string,
};

function SearchInput(props: Props) {
  return (
    <StyleLessSearchInput
      style={SearchInputStyle}
      searchIcon={<Icon icon="SEARCH" />}
      clearButton={({ clearQuery }) => (
        <button type="button" onClick={clearQuery}>
          <Icon icon="CLEAR" />
        </button>
      )}
      {...props}
    />
  );
}

SearchInput.defaultProps = {
  onBlur: () => {},
};

export default SearchInput;
