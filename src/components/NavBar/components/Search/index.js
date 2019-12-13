// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import CInput from 'react-composition-input';
import Icon from 'components/Icon';
import messages from './messages';
import { ClearButtonStyle, SearchButtonStyle, InputStyle, SearchStyle } from './style';

type Props = {
  query: string,
  onChange: string => void,
};

const Search = ({ query, onChange }: Props) => {
  const intl = useIntl();
  const [value, setValue] = React.useState(query || '');
  const [focused, setFocused] = React.useState(false);

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearch = () => {
    onChange(value);
  };

  const handleClear = () => {
    setValue('');
    onChange('');
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={SearchStyle(focused)}>
      <CInput
        className={InputStyle}
        value={value}
        placeholder={intl.formatMessage(messages.placeholder)}
        onInputChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
      />
      {!!value && (
        <button className={ClearButtonStyle} type="button" onClick={handleClear}>
          <Icon icon="CLEAR" />
        </button>
      )}
      <button className={SearchButtonStyle} type="button" onClick={handleSearch}>
        <Icon icon="SEARCH" />
      </button>
    </div>
  );
};

export default Search;
