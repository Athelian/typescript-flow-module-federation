// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { FormattedMessage } from 'react-intl';
import { ToggleInput, SelectInputFactory } from 'components/Form';
import { ApplyButton, ResetButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import PreferenceSetting from '../PreferenceSetting';
import {
  ModalWrapperStyle,
  ActionsWrapperStyle,
  ButtonsWrapperStyle,
  PreferenceWrapperStyle,
  EmailWrapperStyle,
  HeaderStyle,
  InfoTooltipStyle,
  EmailPreferenceStyle,
} from './style';

type Props = {|
  isOpen: boolean,
  onClose: () => void,
|};

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
                  defaultMessage="EMAIL NOTIFICATION"
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
                    editable
                    required
                    hideDropdownArrow
                    hideTooltip
                  />
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

          <div className={PreferenceWrapperStyle}>
            <PreferenceSetting icon="ORDER" columns={[]} onChange={console.warn} />
            <PreferenceSetting icon="PRODUCT" columns={[]} onChange={console.warn} />
            <PreferenceSetting icon="BATCH" columns={[]} onChange={console.warn} />
            <PreferenceSetting icon="SHIPMENT" columns={[]} onChange={console.warn} />
            <PreferenceSetting icon="CONTAINER" columns={[]} onChange={console.warn} />
            <PreferenceSetting icon="COMMENT" columns={[]} onChange={console.warn} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default NotificationPreferences;
