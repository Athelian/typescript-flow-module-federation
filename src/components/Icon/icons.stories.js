/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import 'styles/reset.css';
import { css } from 'react-emotion';
import { colors } from 'styles/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconEnums from './enums';

const AllIconWrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 600px;
  overflow: auto;

  > div {
    width: min-content;
    height: 50px;
    background-color: ${colors.TEAL_HALF};
    padding: 10px;
    margin: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    > svg {
      margin: 0 auto;
    }
  }
`;

storiesOf('Icons', module).add('all', () => (
  <div className={AllIconWrapperStyle}>
    {Object.keys(IconEnums).map(key => (
      <div>
        {key}
        <FontAwesomeIcon icon={IconEnums[key]} fixedWidth />
      </div>
    ))}
  </div>
));
