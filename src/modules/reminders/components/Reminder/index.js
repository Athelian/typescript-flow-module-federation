/* eslint-disable no-unused-vars, no-redeclare */
// @flow
import { Display, Label, ToggleInput } from 'components/Form';
import { FormContainer, FormField } from 'modules/form';
import { Mutation, Query } from 'react-apollo';
import React, { useState } from 'react';

import CloneButton from 'components/Buttons/CloneButton';
import FormattedDate from 'components/FormattedDate';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import loadMore from 'utils/loadMore';
import useUser from 'hooks/useUser';

import {
  ActionsWrapperStyle,
  ButtonStyle,
  LastModifiedWrapperStyle,
  MetadataWrapperStyle,
  NameWrapperStyle,
  SectionWrapperStyle,
} from './style';

type Props = {
  name: string,
  open: Function,
};

const Reminder = ({ name, open }: Props) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={`${SectionWrapperStyle}`}>
      <div className={`${MetadataWrapperStyle}`}>
        <div className={`${NameWrapperStyle}`}>
          <Icon icon="CLOCK" />
          <div>{`${name}`}</div>
        </div>
        <div className={`${LastModifiedWrapperStyle}`}>
          <div>
            <Label>
              <FormattedMessage id="components.form.lastModified" defaultMessage="LAST MODIFIED" />
            </Label>
          </div>
          <Display>
            <FormattedDate value="2012-10-16T11:00:28.556094Z" />
          </Display>
          <UserAvatar firstName="John" lastName="Smith" width="20px" height="20px" />
        </div>
      </div>
      <div className={`${ActionsWrapperStyle}`}>
        <ToggleInput toggled={isOn} onToggle={() => setIsOn(prev => !prev)} />
        <button className={ButtonStyle} type="button" onClick={() => undefined}>
          <Icon icon="CLONE_REGULAR" />
        </button>
        <button className={ButtonStyle} type="button" onClick={() => undefined}>
          <Icon icon="REMOVE" />
        </button>
        <button className={ButtonStyle} type="button" onClick={() => undefined}>
          <Icon icon="CHEVRON_RIGHT" />
        </button>
      </div>
    </div>
  );
};

export default Reminder;
