// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';
import { RadioInput } from 'components/Form';
import { ApolloQueryResult } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import { messagePreferencesMutation } from 'modules/timeline/mutation';
import { TippyStyle } from './style';

type Props = {
  children: React.Node,
  sendType?: boolean,
  refetch: ApolloQueryResult<empty>,
};

const SubmitMenu = ({ children, sendType, refetch }: Props) => {
  const [radioValue, setRadioValue] = React.useState('Send Message');
  const [messagePreferencesMutationUpdate] = useMutation(messagePreferencesMutation);

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
      refetch();
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
            Enter sends a message
            <br />
            (shift + enter adds a new line)
          </div>
        </RadioInput>
      </div>
      <div className="radio-wrapper">
        <RadioInput selected={radioValue === 'New Line'} onToggle={() => toggleRadio('New Line')}>
          <div className="radio-label">
            Enter adds a new line
            <br />
            {`(${getPlatform()} + enter sends a message)`}
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
