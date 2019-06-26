// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import messages from 'modules/import/messages';
import {
  ContainerStyle,
  ErrorsStyle,
  ErrorStyle,
  IconStyle,
  MessageStyle,
  TitleStyle,
} from './style';

type Props = {
  errors: string[],
};

const Errors = ({ errors }: Props) => (
  <div className={ContainerStyle}>
    <h6 className={TitleStyle(errors.length)}>
      <FormattedMessage
        {...(errors.length > 0 ? messages.errors : messages.noErrors)}
        values={{ count: errors.length }}
      />
    </h6>

    {errors.length > 0 && (
      <div className={ErrorsStyle}>
        {errors.map(e => (
          <div className={ErrorStyle} key={e}>
            <i className={IconStyle}>
              <Icon icon="WARNING_TRIANGLE" />
            </i>
            <span className={MessageStyle}>{e}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Errors;
