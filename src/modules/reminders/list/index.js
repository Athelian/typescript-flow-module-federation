/* eslint-disable no-unused-vars, no-redeclare */
// @flow

import { Mutation, Query } from 'react-apollo';

import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import React from 'react';
import { SectionHeader } from 'components/Form';
import loadMore from 'utils/loadMore';
import useUser from 'hooks/useUser';

import Reminder from '../components/Reminder';
import {
  FormWrapperStyle,
  IconStyle,
  LinkStyle,
  SectionWrapperStyle,
  SubTitleWrapperStyle,
} from './style';

type Props = {
  open: Function,
  filterBy: Object,
};

const ReminderList = ({ open, filterBy }: Props) => {
  return (
    <div className={FormWrapperStyle}>
      <SectionHeader
        icon="CLOCK"
        title={<FormattedMessage id="modules.profile.reminders" defaultMessage="REMINDERS" />}
      />
      <div className={`${SubTitleWrapperStyle}`}>
        <FormattedMessage id="modules.reminders.subtitle" />
      </div>
      <div className={`${SectionWrapperStyle}`}>
        <div className={`${IconStyle}`}>
          <Icon icon="CLOCK" />
        </div>
        <div>
          <FormattedMessage
            id="modules.reminders.noReminders"
            defaultMessage="No reminders found. <span>Create New Reminder</span>"
            values={{
              span: chunks => (
                <span
                  className={`${LinkStyle}`}
                  onClick={open}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      open();
                    }
                  }}
                >
                  {chunks}
                </span>
              ),
            }}
          />
        </div>
      </div>
      <Reminder name="1092812" open={open} />
    </div>
  );
};

export default ReminderList;
