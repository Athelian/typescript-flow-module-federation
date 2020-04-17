// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { User } from 'generated/graphql';
import { Label, Display } from 'components/Form';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import SlideView from 'components/SlideView';
import StaffSelector from './StaffSelector';
import {
  FollowersWrapperStyle,
  AvatarsWrapperStyle,
  AvatarWrapperStyle,
  StackedAvatarsWrapperStyle,
  StackedAvatarWrapperStyle,
  StackedMoreStyle,
  PlusButtonStyle,
} from './style';

export const MAX_FOLLOWERS_SHOWN = 5;

type Props = {|
  followers: Array<User>,
  setFollowers: (Array<User>) => void,
  organizationIds: Array<string>,
  editable: boolean,
  height?: number,
  borderColor?: string,
|};

const Followers = ({
  followers = [],
  setFollowers,
  organizationIds = [],
  editable = false,
  height = 30,
  borderColor = 'GRAY_SUPER_LIGHT',
}: Props) => {
  const [isStaffSelectorOpen, setStaffSelectorOpen] = React.useState(false);

  const numOfFollowers = followers.length;

  return (
    <>
      <Tooltip
        message={
          <FormattedMessage
            id="components.followers.tooltip"
            defaultMessage="Followers will receive notifications based on their notification preferences"
          />
        }
        delay={[1000, 200]}
      >
        <button
          className={FollowersWrapperStyle(editable, height)}
          onClick={() => {
            if (editable) {
              setStaffSelectorOpen(true);
            }
          }}
          type="button"
        >
          <Label width="min-content">
            <FormattedMessage id="components.followers.followers" defaultMessage="Followers" />
          </Label>

          {numOfFollowers === 0 ? (
            <>
              {editable ? (
                <div className={PlusButtonStyle}>
                  <Icon icon="ADD" />
                </div>
              ) : (
                <Display width="min-content">
                  <FormattedMessage id="components.cards.na" />
                </Display>
              )}
            </>
          ) : (
            <>
              {numOfFollowers > MAX_FOLLOWERS_SHOWN ? (
                <div className={StackedAvatarsWrapperStyle(MAX_FOLLOWERS_SHOWN)}>
                  {followers.slice(0, MAX_FOLLOWERS_SHOWN).map((follower, index) => (
                    <div
                      className={StackedAvatarWrapperStyle(index, borderColor)}
                      key={follower?.id}
                    >
                      <UserAvatar
                        firstName={follower?.firstName}
                        lastName={follower?.lastName}
                        width="20px"
                        height="20px"
                      />
                    </div>
                  ))}
                  <div className={StackedMoreStyle(MAX_FOLLOWERS_SHOWN, borderColor)}>
                    +{numOfFollowers - MAX_FOLLOWERS_SHOWN}
                  </div>
                </div>
              ) : (
                <div className={AvatarsWrapperStyle}>
                  {followers.map(follower => (
                    <div className={AvatarWrapperStyle(borderColor)} key={follower?.id}>
                      <UserAvatar
                        firstName={follower?.firstName}
                        lastName={follower?.lastName}
                        width="20px"
                        height="20px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </button>
      </Tooltip>

      <SlideView isOpen={isStaffSelectorOpen} onRequestClose={() => setStaffSelectorOpen(false)}>
        <StaffSelector
          selected={followers}
          onSelect={value => {
            setFollowers(value);
            setStaffSelectorOpen(false);
          }}
          onCancel={() => setStaffSelectorOpen(false)}
          organizationIds={organizationIds}
        />
      </SlideView>
    </>
  );
};

export default Followers;
