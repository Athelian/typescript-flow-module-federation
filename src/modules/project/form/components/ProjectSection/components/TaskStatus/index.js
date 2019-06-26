// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import { Label, Display } from 'components/Form';
import messages from './messages';
import { TaskInfoStyle, IconStyle } from './style';

type Props = {
  count: number,
  remain: number,
  inProgress: number,
  completed: number,
  rejected: number,
  approved: number,
  skipped: number,
  delayed: number,
};

export default function TaskStatus({
  count,
  completed,
  remain,
  inProgress,
  delayed,
  skipped,
  rejected,
  approved,
}: Props) {
  return (
    <GridColumn gap="10px">
      <div className={TaskInfoStyle}>
        <div />

        <Label>
          <FormattedMessage {...messages.totalTasks} />
        </Label>

        <Display>{count}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('TEAL')}>
          <Icon icon="CHECKED" />
        </div>

        <Label>
          <FormattedMessage {...messages.completed} />
        </Label>

        <Display>{completed}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('TEAL')}>
          <Icon icon="CLOCK" />
        </div>

        <Label>
          <FormattedMessage {...messages.inProgress} />
        </Label>

        <Display>{inProgress}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('RED')}>
          <Icon icon="STOPWATCH" />
        </div>

        <Label>
          <FormattedMessage {...messages.overdue} />
        </Label>

        <Display>{delayed}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('GRAY_SUPER_LIGHT')}>
          <Icon icon="CHECKED" />
        </div>

        <Label>
          <FormattedMessage {...messages.uncompleted} />
        </Label>

        <Display>{remain}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('GRAY_DARK')}>
          <Icon icon="SKIPPED" />
        </div>

        <Label>
          <FormattedMessage {...messages.skipped} />
        </Label>

        <Display>{skipped}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('BLUE')}>
          <Icon icon="CHECKED" />
        </div>

        <Label>
          <FormattedMessage {...messages.approved} />
        </Label>

        <Display>{approved}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('RED')}>
          <Icon icon="CANCEL" />
        </div>

        <Label>
          <FormattedMessage {...messages.rejected} />
        </Label>

        <Display>{rejected}</Display>
      </div>

      <div className={TaskInfoStyle}>
        <div className={IconStyle('GRAY_SUPER_LIGHT')}>
          <Icon icon="CHECKED" />
        </div>

        <Label>
          <FormattedMessage {...messages.unapproved} />
        </Label>

        <Display>{count - (rejected + approved)}</Display>
      </div>
    </GridColumn>
  );
}
