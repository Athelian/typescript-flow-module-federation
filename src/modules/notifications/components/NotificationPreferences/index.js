// @flow
import * as React from 'react';
import { type NotificationType, NotificationTypeValues } from 'generated/graphql';
import Dialog from 'components/Dialog';
import { FormattedMessage } from 'react-intl';
import { ToggleInput, SelectInputFactory } from 'components/Form';
import { ApplyButton, ResetButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import PreferenceSetting from '../PreferenceSetting';
import messages from './messages';
import {
  NotificationPreferencesModalWrapperStyle,
  NavbarWrapperStyle,
  EmailNotificationsWrapperStyle,
  NavbarRightWrapperStyle,
  InfoTooltipWrapperStyle,
} from './style';

type Props = {|
  isOpen: boolean,
  onClose: () => void,
|};

const preferencesByType = (
  type: string,
  ignoreKeys: Array<string> = []
): Array<NotificationType> => {
  return Object.values(NotificationTypeValues)
    .filter(key => String(key).startsWith(type) && !ignoreKeys.includes(key))
    .map(column => ({
      column,
      title: (
        <FormattedMessage
          {...(messages?.[column] ?? {
            id: `modules.Notification.preferences.${String(column)}`,
            defaultMessage: column,
          })}
        />
      ),
      selected: false,
    }));
};

function NotificationPreferences({ isOpen, onClose }: Props) {
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = React.useState(false);
  const isDirty = false;
  const handleApply = () => {};
  const handleReset = () => {};

  return (
    <Dialog isOpen={isOpen} onRequestClose={onClose}>
      <div className={NotificationPreferencesModalWrapperStyle}>
        <div className={NavbarWrapperStyle}>
          <div className={EmailNotificationsWrapperStyle(isEmailNotificationsEnabled)}>
            <Icon icon="EMAIL" />

            <FormattedMessage
              id="modules.Notifications.emailNotification"
              defaultMessage="Email Notifications"
            />

            <Tooltip
              message={
                isEmailNotificationsEnabled ? (
                  <FormattedMessage
                    id="modules.Notifications.emailTooltipEnabled"
                    defaultMessage="Notifications received will also be sent to your email at the specified interval"
                  />
                ) : (
                  <FormattedMessage
                    id="modules.Notifications.emailTooltipDisabled"
                    defaultMessage="Notifications received will not be sent to your email"
                  />
                )
              }
            >
              <div>
                <ToggleInput
                  toggled={isEmailNotificationsEnabled}
                  onToggle={() => setEmailNotificationsEnabled(!isEmailNotificationsEnabled)}
                />
              </div>
            </Tooltip>

            {isEmailNotificationsEnabled && (
              <SelectInputFactory
                value={{ minutes: 10 }}
                items={[
                  {
                    label: '10 min',
                    value: { minutes: 10 },
                  },
                  {
                    label: '30 min',
                    value: { minutes: 30 },
                  },
                  {
                    label: '1 hr',
                    value: { hours: 1 },
                  },
                  {
                    label: '6 hrs',
                    value: { hours: 6 },
                  },
                  {
                    label: '12 hrs',
                    value: { hours: 12 },
                  },
                ]}
                inputWidth="60px"
                inputHeight="20px"
                editable
                required
                hideDropdownArrow
                hideTooltip
              />
            )}
          </div>

          <div className={NavbarRightWrapperStyle}>
            {isDirty && (
              <>
                <ResetButton onClick={handleReset} />
                <ApplyButton onClick={handleApply} />
              </>
            )}

            <Tooltip
              message={
                <FormattedMessage
                  id="modules.Notifications.settingTooltip"
                  defaultMessage="Changing your notification preferences will take effect on all data that you are following"
                />
              }
            >
              <div className={InfoTooltipWrapperStyle}>
                <Icon icon="INFO" />
              </div>
            </Tooltip>
          </div>
        </div>

        <PreferenceSetting
          icon="ORDER"
          columns={preferencesByType('order', ['order_create_item', 'order_update_item_quantity'])}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="ORDER_ITEM"
          columns={[
            ...preferencesByType('order_create_item'),
            ...preferencesByType('order_update_item_quantity'),
          ]}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="PRODUCT"
          columns={preferencesByType('product', ['product_create_provider'])}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="PRODUCT_PROVIDER"
          columns={preferencesByType('product_create_provider')}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="BATCH"
          columns={preferencesByType('batch')}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="SHIPMENT"
          columns={preferencesByType('shipment')}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="CONTAINER"
          columns={preferencesByType('container')}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="WAREHOUSE"
          columns={preferencesByType('warehouse')}
          onChange={console.warn}
        />

        <PreferenceSetting
          icon="LOGS"
          columns={preferencesByType('comment')}
          onChange={console.warn}
        />
      </div>
    </Dialog>
  );
}

export default NotificationPreferences;
