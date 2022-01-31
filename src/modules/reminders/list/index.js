/* eslint-disable no-unused-vars, no-redeclare */
// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Query, Mutation } from 'react-apollo';
import loadMore from 'utils/loadMore';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { Subscribe } from 'unstated';
import {
  FieldItem,
  Label,
  Display,
  SectionWrapper,
  SectionHeader,
  PasswordInputFactory,
} from 'components/Form';
import { FormField, FormContainer } from 'modules/form';
import GridColumn from 'components/GridColumn';
import { BaseButton } from 'components/Buttons';
import SaveFormButton from 'components/SaveFormButton';
import useUser from 'hooks/useUser';
import Reminder from '../components/Reminder';
import {
  FormWrapperStyle,
  SectionWrapperStyle,
  SubTitleWrapperStyle,
  ButtonWrapperStyle,
  IconStyle,
  LinkStyle,
} from './style';
import { notificationListQuery } from '../query';

type Props = {
  filterBy: Object,
};

const NotificationList = ({ filterBy }: Props) => {
  return (
    <div className={FormWrapperStyle}>
      {/* <SectionWrapper id="add_reminder_section"> */}
      <SectionHeader
        icon="CLOCK"
        title={<FormattedMessage id="modules.profile.reminders" defaultMessage="REMINDERS" />}
      />
      <div className={`${SubTitleWrapperStyle}`}>
        <FormattedMessage id="modules.reminders.subtitle" />
      </div>
      {/* <div className={`${SectionWrapperStyle}`}>
          <div className={`${IconStyle}`}>
            <Icon icon="CLOCK" />
          </div>
          <div style={{ display: 'inline' }}>
            <FormattedMessage
              id="modules.reminders.noReminders"
              defaultMessage="No reminders found. <a>Create New Reminder</a>"
              values={{
                a: chunks => (
                  <a
                    className={`${LinkStyle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://localhost:3002"
                  >
                    {chunks}
                  </a>
                ),
                link: '',
              }}
            />
          </div>
        </div> */}
      <Reminder name="1092812" />
      {/* </SectionWrapper> */}
    </div>
  );
};

export default NotificationList;
