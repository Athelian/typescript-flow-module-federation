// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SearchInput as StylelessSearchInput } from 'components/base';
import { SearchInputStyle, SearchIconStyle, InputStyle, ClearButtonStyle } from './style';

type Props = {|
  round: boolean,
  onBlur: Function,
  onChange: Function,
  onClear: Function,
  name: string,
  value: string,
|};

function SearchInput({ round, ...rest }: Props) {
  return (
    <StylelessSearchInput
      className={SearchInputStyle(round)}
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
      {...rest}
    />
  );
}

SearchInput.defaultProps = {
  round: true,
  onBlur: () => {},
};

export default SearchInput;
