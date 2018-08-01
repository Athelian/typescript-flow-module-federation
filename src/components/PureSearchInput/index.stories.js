import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import Icon from 'components/Icon';
import { layout, colors, borderRadiuses, fontSizes, transitions, presets } from 'styles/common';
import PureSearchInput from './index';

const InputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  width: 100%;
  outline: none;
`;

const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  padding: 5px;
  outline: none;
  &:hover {
    color: ${colors.BLACK};
  }
`;

const SearchInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  background: #fff;
  ${borderRadiuses.BUTTON};
  color: ${colors.GRAY_LIGHT};
  width: 200px;
  height: 30px;
  ${fontSizes.MAIN};
  ${transitions.MAIN};
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    width: 200px;
  }

  & > svg {
    padding: 0 5px;
  }

  input {
    ${InputStyle};
  }

  button {
    ${ClearButtonStyle};
  }
`;

storiesOf('PureSearchInput', module).add('normal', () => (
  <div>
    <PureSearchInput onChange={query => console.log(query)} />
    <PureSearchInput
      style={SearchInputStyle}
      searchIcon={<Icon icon="faSearch" />}
      clearButton={({ clearQuery }) => (
        <button onClick={clearQuery}>
          <Icon icon="faClear" />
        </button>
      )}
      onChange={query => console.log(query)}
    />
  </div>
));
