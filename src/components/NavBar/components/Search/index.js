// @flow
import * as React from 'react';
import CInput from 'react-composition-input';
import Icon from 'components/Icon';
import useDebounce from 'hooks/useDebounce';
import { ClearButtonStyle, IconStyle, InputStyle, SearchStyle } from './style';

type Props = {
  query: string,
  onChange: string => void,
};

const Search = ({ query, onChange }: Props) => {
  const [value, setValue] = React.useState(query || '');
  const debouncedValue = useDebounce(value, 500);

  React.useEffect(() => {
    onChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onChange('');
  };

  return (
    <div className={SearchStyle}>
      <i className={IconStyle}>
        <Icon icon="SEARCH" />
      </i>
      <CInput
        className={InputStyle}
        value={value}
        onInputChange={handleChange}
        onKeyDown={e => e.stopPropagation()}
      />
      {!!value && (
        <button className={ClearButtonStyle} type="button" onClick={handleClear}>
          <Icon icon="CLEAR" />
        </button>
      )}
    </div>
  );
};

export default Search;
