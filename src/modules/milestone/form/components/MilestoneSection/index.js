// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { UserConsumer } from 'modules/user';
import MilestoneStateContainer from 'modules/milestone/form/container';
import validator from 'modules/tags/form/validator';
import { FormField } from 'modules/form';

import UserAvatar from 'components/UserAvatar';
import {
  SectionHeader,
  SectionWrapper,
  LastModified,
  TextInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
  SelectInputFactory,
} from 'components/Form';
import GridColumn from 'components/GridColumn';

import { todayForDateInput } from 'utils/date';
import usePermission from 'hooks/usePermission';
import {
  MILESTONE_CREATE,
  MILESTONE_UPDATE,
  MILESTONE_SET_NAME,
  MILESTONE_SET_COMPLETED,
  MILESTONE_SET_DUE_DATE,
  MILESTONE_SET_DESCRIPTION,
} from 'modules/permission/constants/milestone';

import {
  CommonFormWrapperStyle,
  MilestoneSectionStyle,
  FieldsWrapperStyle,
  StatusWrapperStyle,
  CompletedAvatarStyle,
  StatusColorStyle,
} from './style';

type Props = {
  intl: IntlShape,
};

const MilestoneSection = ({ intl }: Props) => {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(MILESTONE_CREATE);
  const canUpdate = hasPermission(MILESTONE_UPDATE);
  const canCreateOrUpdate = canCreate || canUpdate;

  return (
    <Subscribe to={[MilestoneStateContainer]}>
      {({ originalValues, state: values, setFieldValue }) => {
        const { updatedAt, updatedBy } = originalValues;
        const { completedAt, completedBy } = values;
        const milestoneStatus = values.completedAt ? 'completed' : 'uncompleted';

        return (
          <div className={CommonFormWrapperStyle}>
            <SectionWrapper id="milestone_section">
              <SectionHeader
                icon="MILESTONE"
                title={
                  <FormattedMessage id="modules.milestone.milestone" defaultMessage="MILESTONE" />
                }
              >
                {updatedAt && <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />}
              </SectionHeader>

              <div className={MilestoneSectionStyle}>
                <div className={FieldsWrapperStyle}>
                  <GridColumn>
                    <FormField
                      name="name"
                      initValue={values.name}
                      validator={validator}
                      values={values}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          {...inputHandlers}
                          required
                          originalValue={originalValues[name]}
                          label={<FormattedMessage id="common.name" defaultMessage="NAME" />}
                          editable={canCreateOrUpdate || hasPermission(MILESTONE_SET_NAME)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="dueDate"
                      initValue={values.dueDate}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={<FormattedMessage id="common.dueDate" defaultMessage="DUE DATE" />}
                          editable={canCreateOrUpdate || hasPermission(MILESTONE_SET_DUE_DATE)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="description"
                      initValue={values.description}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextAreaInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="common.description"
                              defaultMessage="DESCRIPTION"
                            />
                          }
                          inputHeight="100px"
                          inputWidth="400px"
                          editable={canCreateOrUpdate || hasPermission(MILESTONE_SET_DESCRIPTION)}
                        />
                      )}
                    </FormField>
                  </GridColumn>

                  <GridColumn>
                    <UserConsumer>
                      {({ user }) => (
                        <div className={StatusWrapperStyle}>
                          <FormField name="completedBy" initValue={milestoneStatus} values={values}>
                            {({ ...inputHandlers }) => (
                              <span className={StatusColorStyle(completedAt)}>
                                <SelectInputFactory
                                  {...inputHandlers}
                                  items={[
                                    {
                                      value: 'uncompleted',
                                      label: intl.formatMessage({
                                        id: 'modules.milestone.uncompleted',
                                        defaultMessage: 'Uncompleted',
                                      }),
                                    },
                                    {
                                      value: 'completed',
                                      label: intl.formatMessage({
                                        id: 'modules.milestone.completed',
                                        defaultMessage: 'Completed',
                                      }),
                                    },
                                  ]}
                                  onChange={event => {
                                    const { value: status } = event.target;
                                    if (status === 'completed') {
                                      setFieldValue('completedAt', todayForDateInput());
                                      setFieldValue('completedBy', user);
                                    } else {
                                      setFieldValue('completedAt', null);
                                      setFieldValue('completedBy', null);
                                    }
                                  }}
                                  required
                                  hideTooltip
                                  vertical
                                  label={
                                    <FormattedMessage
                                      id="modules.milestone.status"
                                      defaultMessage="STATUS"
                                    />
                                  }
                                  editable={
                                    canCreateOrUpdate || hasPermission(MILESTONE_SET_COMPLETED)
                                  }
                                />
                              </span>
                            )}
                          </FormField>
                          {completedBy && (
                            <div className={CompletedAvatarStyle}>
                              <UserAvatar
                                firstName={completedBy.firstName}
                                lastName={completedBy.lastName}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </UserConsumer>

                    {completedAt && (
                      <FormField
                        name="completedAt"
                        initValue={completedAt}
                        values={values}
                        validator={validator}
                        setFieldValue={setFieldValue}
                      >
                        {({ name, ...inputHandlers }) => (
                          <DateInputFactory
                            name={name}
                            {...inputHandlers}
                            originalValue={originalValues[name]}
                            label={
                              <FormattedMessage
                                id="common.completedDate"
                                defaultMessage="COMPLETED DATE"
                              />
                            }
                            vertical
                            required
                            editable={canCreateOrUpdate}
                          />
                        )}
                      </FormField>
                    )}
                  </GridColumn>
                </div>
              </div>
            </SectionWrapper>
          </div>
        );
      }}
    </Subscribe>
  );
};
export default injectIntl(MilestoneSection);
