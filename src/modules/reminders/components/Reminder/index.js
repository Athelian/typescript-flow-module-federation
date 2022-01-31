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
  ToggleInput,
  PasswordInputFactory,
} from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import UserAvatar from 'components/UserAvatar';
import useUser from 'hooks/useUser';
import CloneButton from 'components/Buttons/CloneButton';
import { FormField, FormContainer } from 'modules/form';
import GridColumn from 'components/GridColumn';
import SaveFormButton from 'components/SaveFormButton';
import {
  ReminderLeftSection,
  ActionsWrapperStyle,
  ButtonStyle,
  LastModifiedWrapperStyle,
  SectionWrapperStyle,
  ReminderHeaderStyle,
} from './style';

type Props = {
  name: string,
};

const Reminder = ({ name }: Props) => {
  return (
    <div className={`${SectionWrapperStyle}`}>
      <div className={`${ReminderLeftSection}`}>
        <div className={`${ReminderHeaderStyle}`}>
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
        <ToggleInput
          toggled
          // onToggle={() => set('editable', !editable)}
        />
        <button className={ButtonStyle} type="button" onClick={() => undefined}>
          {/* {isActive && <span className={ActiveStyle} />} */}
          <Icon icon="CLONE_REGULAR" />
        </button>
        <button className={ButtonStyle} type="button" onClick={() => undefined}>
          {/* {isActive && <span className={ActiveStyle} />} */}
          <Icon icon="REMOVE" />
        </button>
        <button
          className={ButtonStyle}
          type="button"
          onClick={() => undefined}
          style={{ fontSize: '20px' }}
        >
          <Icon icon="CHEVRON_RIGHT" />
        </button>
      </div>
    </div>
  );
};

export default Reminder;
