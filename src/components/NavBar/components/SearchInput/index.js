// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SearchInput as StylelessSearchInput } from 'components/base';
import { SearchInputStyle, SearchIconStyle, InputStyle, ClearButtonStyle } from './style';

type Props = {
  onChange: Function,
  onBlur?: Function,
  onClear: Function,
  name: string,
  value: string,
};

function SearchInput(props: Props) {
  return (
    <StylelessSearchInput
      className={SearchInputStyle}
      inputClassName={InputStyle}
      searchIcon={
        <div className={SearchIconStyle}>
          <Icon icon="SEARCH" />
        </div>
      }
      clearButton={({ clearQuery }) => (
        <button className={ClearButtonStyle} type="button" onClick={clearQuery}>
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
