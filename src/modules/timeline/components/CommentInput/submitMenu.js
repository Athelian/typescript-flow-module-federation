// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';
import { RadioInput } from 'components/Form';
import { useIntl } from 'react-intl';
import { ApolloQueryResult } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import { messagePreferencesMutation } from 'modules/timeline/mutation';
import messages from 'modules/timeline/messages';
import { TippyStyle } from './style';

type Props = {
  children: React.Node,
  sendType?: boolean,
  refetch: ApolloQueryResult<empty>,
};

const SubmitMenu = ({ children, sendType, refetch }: Props) => {
  const [radioValue, setRadioValue] = React.useState('Send Message');
  const [messagePreferencesMutationUpdate] = useMutation(messagePreferencesMutation);
  const intl = useIntl();

  React.useEffect(() => {
    if (sendType) {
      setRadioValue('Send Message');
    } else {
      setRadioValue('New Line');
    }
  }, [sendType]);

  const toggleRadio = value => {
    setRadioValue(value);
    messagePreferencesMutationUpdate({
      variables: {
        input: {
          sendMessageByEnter: value === 'Send Message',
        },
      },
    }).then(() => {
      if (refetch) {
        refetch();
      }
    });
  };

  const getPlatform = () => {
    const { platform } = navigator;
    if (platform === 'Mac68K' || platform === 'MacPPC' || platform === 'MacIntel') {
      return 'cmd';
    }
    return 'ctrl';
  };

  const message = (
    <div className="menu-options">
      <div className="radio-wrapper">
        <RadioInput
          selected={radioValue === 'Send Message'}
          onToggle={() => toggleRadio('Send Message')}
        >
          <div className="radio-label">
            {`Enter ${intl.formatMessage(messages.sendMessage)}`}
            <br />
            {`(shift + enter ${intl.formatMessage(messages.newLine)})`}
          </div>
        </RadioInput>
      </div>
      <div className="radio-wrapper">
        <RadioInput selected={radioValue === 'New Line'} onToggle={() => toggleRadio('New Line')}>
          <div className="radio-label">
            {`Enter ${intl.formatMessage(messages.newLine)}`}
            <br />
            {`(${getPlatform()} + Enter ${intl.formatMessage(messages.sendMessage)})`}
          </div>
        </RadioInput>
      </div>
    </div>
  );
  return (
    <Tippy
      className={TippyStyle}
      content={message}
      delay={100}
      distance={10}
      interactive
      // ignoreAttributes
      trigger="click"
      placement="top-end"
    >
      {children}
    </Tippy>
  );
};

export default SubmitMenu;
