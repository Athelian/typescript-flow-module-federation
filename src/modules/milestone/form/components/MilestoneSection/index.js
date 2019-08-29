// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { UserConsumer } from 'modules/user';
import UserAvatar from 'components/UserAvatar';
import MilestoneStateContainer from 'modules/milestone/form/container';
import validator from 'modules/tags/form/validator';
import { FormField } from 'modules/form';

import { todayForDateInput } from 'utils/date';
import {
  Label,
  SectionHeader,
  SectionWrapper,
  LastModified,
  TextInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
  SelectInputFactory,
} from 'components/Form';

import GridColumn from 'components/GridColumn';
import {
  CommonFormWrapperStyle,
  MilestoneSectionStyle,
  FieldsWrapperStyle,
  DescriptionLabelWrapperStyle,
  StatusWrapperStyle,
  CompletedAvatarStyle,
} from './style';

const MilestoneSection = () => {
  // const { hasPermission } = usePermission();
  // const allowCreate = hasPermission(TAG_CREATE);
  // const allowUpdate = hasPermission(TAG_UPDATE);
  // const allowCreateOrUpdate = allowCreate || allowUpdate;
  const canCreateOrUpdate = true;

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
                          editable={canCreateOrUpdate}
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
                          editable={canCreateOrUpdate}
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
                            <div className={DescriptionLabelWrapperStyle}>
                              <FormattedMessage
                                id="common.description"
                                defaultMessage="DESCRIPTION"
                              />
                            </div>
                          }
                          inputHeight="100px"
                          inputWidth="200px"
                          editable={canCreateOrUpdate}
                        />
                      )}
                    </FormField>
                  </GridColumn>

                  <GridColumn>
                    <Label>
                      <FormattedMessage id="modules.milestone.status" defaultMessage="STATUS" />
                    </Label>
                    <UserConsumer>
                      {({ user }) => (
                        <div className={StatusWrapperStyle}>
                          <FormField name="completeBy" initValue={milestoneStatus}>
                            {({ ...inputHandlers }) => (
                              <SelectInputFactory
                                {...inputHandlers}
                                items={[
                                  { label: 'uncompleted', value: 'uncompleted' },
                                  { label: 'completed', value: 'completed' },
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
                                hideTooltip
                                editable={canCreateOrUpdate}
                              />
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
export default MilestoneSection;
