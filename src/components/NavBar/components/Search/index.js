// @flow
import * as React from 'react';
import CInput from 'react-composition-input';
import Icon from 'components/Icon';
import {
  ClearButtonStyle,
  SearchButtonStyle,
  InputStyle,
  SearchStyle,
  SeparatorStyle,
} from './style';

type Props = {
  query: string,
  onChange: string => void,
};

const Search = ({ query, onChange }: Props) => {
  const [value, setValue] = React.useState(query || '');

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearch = () => {
    onChange(value);
  };

  const handleClear = () => {
    setValue('');
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={SearchStyle}>
      <CInput
        className={InputStyle}
        value={value}
        onInputChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {!!value && (
        <button className={ClearButtonStyle} type="button" onClick={handleClear}>
          <Icon icon="CLEAR" />
        </button>
      )}
      <hr className={SeparatorStyle} />
      <button className={SearchButtonStyle} type="button" onClick={handleSearch}>
        <Icon icon="SEARCH" />
      </button>
    </div>
  );
};

export default Search;
