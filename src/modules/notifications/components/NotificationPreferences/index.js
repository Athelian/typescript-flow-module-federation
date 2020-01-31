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
  ModalWrapperStyle,
  ActionsWrapperStyle,
  ButtonsWrapperStyle,
  EmailWrapperStyle,
  HeaderStyle,
  InfoTooltipStyle,
  EmailPreferenceStyle,
  IntervalStyle,
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
      title: messages[column] ? (
        <FormattedMessage {...messages[column]} />
      ) : (
        // <FormattedMessage
        //   id={`modules.Notification.preferences.${String(column)}`}
        //   defaultMessage={String(column)}
        // />
        <>TODO</>
      ),
      selected: false,
    }));
};

function NotificationPreferences({ isOpen, onClose }: Props) {
  const [toggled, setToggle] = React.useState(false);
  const isDirty = false;
  const handleApply = () => {};
  const handleReset = () => {};
  const onToggle = () => {
    setToggle(!toggled);
  };

  return (
    <Dialog isOpen={isOpen} onRequestClose={onClose}>
      <div className={ModalWrapperStyle}>
        <div className={HeaderStyle}>
          <div className={ActionsWrapperStyle}>
            <div className={EmailWrapperStyle}>
              <div>
                <Icon icon="EMAIL" />
                <FormattedMessage
                  id="modules.Notifications.emailNotification"
                  defaultMessage="Email Notifications"
                />
              </div>
              <div className={EmailPreferenceStyle}>
                <Tooltip
                  message={
                    <FormattedMessage
                      id="modules.Notifications.emailTooltip"
                      defaultMessage="Notifications received will also be sent to your email at the specified interval"
                    />
                  }
                >
                  <div>
                    <ToggleInput toggled={toggled} onToggle={onToggle} />
                  </div>
                </Tooltip>
                {toggled && (
                  <div className={IntervalStyle}>
                    <SelectInputFactory
                      value="10m"
                      items={[
                        {
                          label: '10 Minutes',
                          value: '10m',
                        },
                        {
                          label: '30 Minutes',
                          value: '30m',
                        },
                        {
                          label: '1 Hour',
                          value: '1h',
                        },
                        {
                          label: '12 Hour',
                          value: '12h',
                        },
                      ]}
                      inputWidth="80px"
                      inputHeight="20px"
                      editable
                      required
                      hideDropdownArrow
                      hideTooltip
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={ButtonsWrapperStyle}>
              <ResetButton onClick={handleReset} disabled={!isDirty} />
              <ApplyButton onClick={handleApply} />
              <Tooltip
                message={
                  <FormattedMessage
                    id="modules.Notifications.settingTooltip"
                    defaultMessage="Changing your notification preferences will take effect on all data that you are following"
                  />
                }
              >
                <div className={InfoTooltipStyle}>
                  <Icon icon="INFO" />
                </div>
              </Tooltip>
            </div>
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
