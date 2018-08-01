// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import PureSearchInput from 'components/PureSearchInput';
import { SearchInputStyle } from './style';

type Props = {
  onChange: (value: string) => void,
};

function SearchInput({ onChange }: Props) {
  return (
    <PureSearchInput
      style={SearchInputStyle}
      searchIcon={<Icon icon="faSearch" />}
      clearButton={({ clearQuery }) => (
        <button onClick={clearQuery}>
          <Icon icon="faClear" />
        </button>
      )}
      onChange={onChange}
    />
  );
}

export default SearchInput;
