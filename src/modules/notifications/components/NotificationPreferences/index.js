// @flow
import * as React from 'react';
import {
  type NotificationType,
  NotificationTypeValues,
  NotificationPreference,
} from 'generated/graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';
import LoadingIcon from 'components/LoadingIcon';
import Dialog from 'components/Dialog';
import { ToggleInput, SelectInputFactory } from 'components/Form';
import { ApplyButton, ResetButton, IconButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { notificationPreferencesQuery } from 'modules/notifications/query';
import PreferenceSetting from '../PreferenceSetting';
import { notificationPreferencesUpdateMutation } from './mutation';
import messages from './messages';
import {
  NotificationPreferencesModalWrapperStyle,
  NavbarWrapperStyle,
  NavbarLeftWrapperStyle,
  EmailNotificationsWrapperStyle,
  NavbarRightWrapperStyle,
  InfoTooltipWrapperStyle,
} from './style';

type Props = {|
  isOpen: boolean,
  onClose: () => void,
|};

const preferencesByType = ({
  entity,
  ignoreKeys = [],
  preferences = [],
}: {
  entity: string,
  preferences: Array<NotificationPreference>,
  ignoreKeys?: Array<string>,
}): Array<NotificationType> => {
  return Object.values(NotificationTypeValues)
    .filter(key => String(key).startsWith(entity) && !ignoreKeys.includes(key))
    .map(type => ({
      type,
      title: (
        <FormattedMessage
          {...(messages?.[type] ?? {
            id: `modules.Notification.preferences.${String(type)}`,
            defaultMessage: type,
          })}
        />
      ),
      enabled: preferences.find(item => item?.type === type)?.enabled ?? false,
    }));
};

const defaultTimer = null;

const parseIntervalToAPI = (value: string) => {
  switch (value) {
    case 'instant':
      return null;
    case '10m':
      return {
        minutes: 10,
        hours: 0,
      };
    case '30m':
      return {
        minutes: 30,
        hours: 0,
      };
    case '1hr':
      return {
        minutes: 0,
        hours: 1,
      };
    case '6hr':
      return {
        minutes: 0,
        hours: 6,
      };
    case '12hr':
      return {
        minutes: 0,
        hours: 12,
      };
    default:
      return null;
  }
};

const parseIntervalFromAPI = (value: ?Object) => {
  if (value?.minutes === 10) return '10m';
  if (value?.minutes === 30) return '30m';
  if (value?.hours === 1) return '1hr';
  if (value?.hours === 6) return '6hr';
  if (value?.hours === 12) return '12hr';
  return 'instant';
};

function NotificationPreferences({ isOpen, onClose }: Props) {
  const intl = useIntl();
  const [notificationPreferencesUpdate] = useMutation(notificationPreferencesUpdateMutation);
  const [isEmailNotificationsEnabled, setEmailNotificationsEnabled] = React.useState(false);
  const [preferences, setPreferences] = React.useState([]);
  const [timer, setTimer] = React.useState('instant');
  const { data, loading, error, refetch } = useQuery(notificationPreferencesQuery, {
    onCompleted: result => {
      setEmailNotificationsEnabled(result?.viewer?.notificationPreferences?.allowedEmail ?? false);
      setPreferences(result?.viewer?.notificationPreferences?.notifications ?? []);
      setTimer(
        parseIntervalFromAPI(
          removeTypename(result?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer)
        )
      );
    },
  });

  const isDirty =
    data?.viewer?.notificationPreferences?.allowedEmail !== isEmailNotificationsEnabled ||
    !isEquals(
      parseIntervalFromAPI(
        removeTypename(data?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer)
      ),
      timer
    ) ||
    !isEquals(data?.viewer?.notificationPreferences?.notifications ?? [], preferences);

  const togglePreference = (type: string, enabled: boolean) => {
    setPreferences(preferences.map(item => (item.type === type ? { ...item, enabled } : item)));
  };

  const handleSelectAll = () => {
    setPreferences(preferences.map(item => ({ ...item, enabled: true })));
  };

  const handleUnselectAll = () => {
    setPreferences(preferences.map(item => ({ ...item, enabled: false })));
  };

  const handleApply = () => {
    notificationPreferencesUpdate({
      variables: {
        input: {
          allowedEmail: isEmailNotificationsEnabled,
          emailInterval: parseIntervalToAPI(timer),
          notifications: preferences.map(({ type, enabled }) => ({ type, enabled })),
        },
      },
    }).then(() => {
      refetch();
    });
  };

  const handleReset = React.useCallback(() => {
    setEmailNotificationsEnabled(data?.viewer?.notificationPreferences?.allowedEmail ?? false);
    setPreferences(data?.viewer?.notificationPreferences?.notifications ?? []);
    setTimer(
      parseIntervalFromAPI(
        removeTypename(data?.viewer?.notificationPreferences?.emailInterval ?? defaultTimer)
      )
    );
  }, [data]);

  // Clear state after closing setting
  React.useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [handleReset, isOpen]);

  if (error) {
    return error.message;
  }

  return (
    <Dialog isOpen={isOpen} onRequestClose={onClose}>
      <div className={NotificationPreferencesModalWrapperStyle}>
        <div className={NavbarWrapperStyle}>
          <div className={NavbarLeftWrapperStyle}>
            <Tooltip message={<FormattedMessage {...messages.columnsConfigUnselectAllButton} />}>
              <IconButton
                onClick={handleUnselectAll}
                icon="UNCHECKED"
                textColor="GRAY_DARK"
                hoverTextColor="WHITE"
                backgroundColor="GRAY_SUPER_LIGHT"
                hoverBackgroundColor="GRAY_LIGHT"
              />
            </Tooltip>
            <Tooltip message={<FormattedMessage {...messages.columnsConfigSelectAllButton} />}>
              <IconButton
                onClick={handleSelectAll}
                icon="CHECKED"
                textColor="GRAY_DARK"
                hoverTextColor="WHITE"
                backgroundColor="GRAY_SUPER_LIGHT"
                hoverBackgroundColor="GRAY_LIGHT"
              />
            </Tooltip>

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
                  value={timer}
                  items={[
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.instant',
                        defaultMessage: 'Instant',
                      }),
                      value: 'instant',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.tenMinutes',
                        defaultMessage: '10 min',
                      }),
                      value: '10m',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.thirtyMinutes',
                        defaultMessage: '30 min',
                      }),
                      value: '30m',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.oneHour',
                        defaultMessage: '1 hr',
                      }),
                      value: '1hr',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.sixHours',
                        defaultMessage: '6 hrs',
                      }),
                      value: '6hr',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'modules.Notifications.twelveHours',
                        defaultMessage: '12 hrs',
                      }),
                      value: '12hr',
                    },
                  ]}
                  inputWidth="80px"
                  inputHeight="20px"
                  editable
                  required
                  hideDropdownArrow
                  hideTooltip
                  onChange={evt => setTimer(evt.target.value)}
                />
              )}
            </div>
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

        {loading && !data ? (
          <LoadingIcon />
        ) : (
          <>
            <PreferenceSetting
              icon="ORDER"
              preferences={preferencesByType({
                preferences,
                entity: 'order',
                ignoreKeys: ['order_create_item', 'order_update_item_quantity'],
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="ORDER_ITEM"
              preferences={[
                ...preferencesByType({
                  preferences,
                  entity: 'order_create_item',
                }),
                ...preferencesByType({
                  preferences,
                  entity: 'order_update_item_quantity',
                }),
              ]}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="PRODUCT"
              preferences={preferencesByType({
                preferences,
                entity: 'product',
                ignoreKeys: ['product_create_provider'],
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="PRODUCT_PROVIDER"
              preferences={preferencesByType({
                preferences,
                entity: 'product_create_provider',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="BATCH"
              preferences={preferencesByType({
                preferences,
                entity: 'batch',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="SHIPMENT"
              preferences={preferencesByType({
                preferences,
                entity: 'shipment',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="CONTAINER"
              preferences={preferencesByType({
                preferences,
                entity: 'container',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="WAREHOUSE"
              preferences={preferencesByType({
                preferences,
                entity: 'warehouse',
              })}
              onChange={togglePreference}
            />

            <PreferenceSetting
              icon="LOGS"
              preferences={preferencesByType({
                preferences,
                entity: 'comment',
              })}
              onChange={togglePreference}
            />
          </>
        )}
      </div>
    </Dialog>
  );
}

export default NotificationPreferences;
