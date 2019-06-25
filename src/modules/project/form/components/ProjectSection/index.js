// @flow
import * as React from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ProjectInfoContainer,
  ProjectTagsContainer,
  ProjectMilestonesContainer,
} from 'modules/project/form/containers';
import validator from 'modules/project/form/validator';
import { FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
import MilestonesTimeline from 'components/MilestonesTimeline';
import {
  FieldItem,
  Label,
  TagsInput,
  TextInputFactory,
  TextAreaInputFactory,
  DateInputFactory,
} from 'components/Form';
import { PROJECT_UPDATE } from 'modules/permission/constants/project';
import messages from 'modules/project/messages';
import {
  ProjectSectionWrapperStyle,
  MainFieldsWrapperStyle,
  BoxWrapperStyle,
  WarningColorStyle,
} from './style';
import TaskStatus from './components/TaskStatus';
import BindingAndRelatedEntities from './components/BindingAndRelatedEntities';

type Props = {
  isNew: boolean,
  project: Object,
};
const ProjectSection = ({ isNew }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const editable = hasPermission([PROJECT_UPDATE]);
  return (
    <div className={ProjectSectionWrapperStyle}>
      <Subscribe to={[ProjectInfoContainer]}>
        {({ originalValues: initialValues, state, setFieldValue }) => {
          const values = { ...initialValues, ...state };
          return (
            <>
              <GridColumn>
                <div className={MainFieldsWrapperStyle}>
                  <GridColumn>
                    <FormField
                      name="name"
                      initValue={values.name}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          required
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.name} />}
                          editable={editable}
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
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.description} />}
                          editable={editable}
                          vertical
                          inputWidth="400px"
                          inputHeight="115px"
                        />
                      )}
                    </FormField>
                    <Subscribe to={[ProjectTagsContainer]}>
                      {({ state: { tags }, setFieldValue: changeTags }) => (
                        <FieldItem
                          vertical
                          label={
                            <Label height="30px">
                              <FormattedMessage {...messages.tags} />
                            </Label>
                          }
                          input={
                            <TagsInput
                              id="tags"
                              name="tags"
                              tagType="Project"
                              values={tags}
                              onChange={(field, value) => {
                                changeTags(field, value);
                              }}
                              editable={editable}
                            />
                          }
                        />
                      )}
                    </Subscribe>
                  </GridColumn>
                  <GridColumn>
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
                          isNew={isNew}
                          originalValue={initialValues[name]}
                          label={<FormattedMessage {...messages.dueDate} />}
                          editable={editable}
                        />
                      )}
                    </FormField>
                    <Subscribe to={[ProjectMilestonesContainer]}>
                      {({ lastMilestoneDueDate }) => (
                        <>
                          <FormField
                            name="lastMilestoneDueDate"
                            initValue={lastMilestoneDueDate()}
                            values={values}
                            validator={validator}
                            setFieldValue={setFieldValue}
                          >
                            {({ name, ...inputHandlers }) => (
                              <DateInputFactory
                                name={name}
                                {...inputHandlers}
                                isNew={isNew}
                                originalValue={lastMilestoneDueDate()}
                                label={<FormattedMessage {...messages.lastMilestoneDueDate} />}
                                editable={false}
                              />
                            )}
                          </FormField>
                          {lastMilestoneDueDate() && values.dueDate && (
                            <p
                              className={WarningColorStyle(
                                differenceInCalendarDays(lastMilestoneDueDate(), values.dueDate)
                              )}
                            >
                              {differenceInCalendarDays(lastMilestoneDueDate(), values.dueDate)}
                              <FormattedMessage
                                {...messages.diffBetweenLastMilestoneAndProjectDueDate}
                              />
                            </p>
                          )}
                        </>
                      )}
                    </Subscribe>
                  </GridColumn>
                </div>
                <div className={BoxWrapperStyle}>
                  <Subscribe to={[ProjectMilestonesContainer]}>
                    {({ state: { milestones } }) => <MilestonesTimeline milestones={milestones} />}
                  </Subscribe>
                </div>
              </GridColumn>
              <div className={BoxWrapperStyle}>
                <TaskStatus {...values.taskCount} />
              </div>
              <div className={BoxWrapperStyle}>
                <Subscribe to={[ProjectMilestonesContainer]}>
                  {({ countBindingEntities, countRelatedEntities }) => (
                    <BindingAndRelatedEntities
                      binding={countBindingEntities()}
                      related={countRelatedEntities(values.id)}
                    />
                  )}
                </Subscribe>
              </div>
            </>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default ProjectSection;
