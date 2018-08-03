// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSearchInput from 'components/base/SearchInput';
import { SearchInputStyle } from './style';

type Props = {
  onChange: (value: string) => void,
};

function SearchInput({ onChange }: Props) {
  return (
    <StyleLessSearchInput
      style={SearchInputStyle}
      searchIcon={<Icon icon="faSearch" />}
      clearButton={({ clearQuery }) => (
        <button type="button" onClick={clearQuery}>
          <Icon icon="faClear" />
        </button>
      )}
      onChange={onChange}
    />
  );
}

export default SearchInput;
