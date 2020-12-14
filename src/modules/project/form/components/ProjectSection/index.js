// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import emitter from 'utils/emitter';
import {
  ProjectInfoContainer,
  ProjectTagsContainer,
  ProjectMilestonesContainer,
} from 'modules/project/form/containers';
import validator from 'modules/project/form/validator';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import GridRow from 'components/GridRow';
import { BooleanValue } from 'react-values';
import {
  FieldItem,
  Label,
  TagsInput,
  TextInputFactory,
  TextAreaInputFactory,
  DateInputFactory,
  Display,
  ToggleInput,
} from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import {
  PROJECT_UPDATE,
  PROJECT_SET_NAME,
  PROJECT_SET_DESCRIPTION,
  PROJECT_SET_DUE_DATE,
  PROJECT_SET_TAGS,
} from 'modules/permission/constants/project';
import { TAG_LIST } from 'modules/permission/constants/tag';
import messages from 'modules/project/messages';
import {
  ProjectSectionWrapperStyle,
  MainSectionWrapperStyle,
  ProjectInfoWrapperStyle,
  DescriptionTagsWrapperStyle,
  DescriptionWrapperStyle,
  TagsWrapperStyle,
  MilestonesTimelineWrapperStyle,
  TasksInfoWrapperStyle,
  ExpandWrapperStyle,
  ProjectCardBodyStyle,
} from './style';
import TaskStatus from './components/TaskStatus';
import MilestoneTimelineItem from '../MilestoneTimelineItem';

type Props = {
  isNew: boolean,
  project: Object,
};
const ProjectSection = ({ isNew }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <>
      <div className={ProjectSectionWrapperStyle(isExpanded)}>
        <Subscribe to={[ProjectInfoContainer]}>
          {({ originalValues: initialValues, state, setFieldValue }) => {
            const values = { ...initialValues, ...state };
            return (
              <>
                <div className={MainSectionWrapperStyle}>
                  <div className={ProjectInfoWrapperStyle}>
                    <GridRow>
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
                            editable={hasPermission([PROJECT_UPDATE, PROJECT_SET_NAME])}
                            vertical
                            inputAlign="left"
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
                            onBlur={evt => {
                              inputHandlers.onBlur(evt);
                              setTimeout(() => {
                                emitter.emit('AUTO_DATE', name, evt?.target?.value || null);
                              }, 200);
                            }}
                            isNew={isNew}
                            originalValue={initialValues[name]}
                            label={<FormattedMessage {...messages.dueDate} />}
                            editable={hasPermission([PROJECT_UPDATE, PROJECT_SET_DUE_DATE])}
                            vertical
                            inputAlign="left"
                            handleTimezone
                          />
                        )}
                      </FormField>
                      <Subscribe to={[ProjectMilestonesContainer]}>
                        {({ lastMilestoneDueDate }) => (
                          <FieldItem
                            vertical
                            label={
                              <Label height="30px">
                                <FormattedMessage {...messages.lastMilestoneDueDate} />
                              </Label>
                            }
                            input={
                              <Display height="30px" align="left" width="200px">
                                <FormattedDate value={lastMilestoneDueDate()} />
                              </Display>
                            }
                          />
                        )}
                      </Subscribe>
                      <BooleanValue value={!!values.archived}>
                        {({ value: isArchived, set: setArchivedToggle }) => {
                          return (
                            <ToggleInput
                              toggled={isArchived}
                              onToggle={() => {
                                setArchivedToggle(!isArchived);
                                setFieldValue('archived', !isArchived);
                              }}
                            >
                              <Label>
                                <FormattedMessage {...messages.archived} />
                              </Label>
                            </ToggleInput>
                          );
                        }}
                      </BooleanValue>
                    </GridRow>

                    <div className={DescriptionTagsWrapperStyle}>
                      <div className={DescriptionWrapperStyle}>
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
                              editable={hasPermission([PROJECT_UPDATE, PROJECT_SET_DESCRIPTION])}
                              vertical
                              inputWidth="420px"
                              inputHeight="80px"
                            />
                          )}
                        </FormField>
                      </div>

                      <Subscribe to={[ProjectTagsContainer]}>
                        {({ state: { tags }, setFieldValue: changeTags }) => (
                          <div className={TagsWrapperStyle}>
                            <Label height="30px">
                              <FormattedMessage {...messages.tags} />
                            </Label>

                            <TagsInput
                              id="tags"
                              name="tags"
                              tagType="Project"
                              values={tags}
                              onChange={value => {
                                changeTags('tags', value);
                              }}
                              onClickRemove={value => {
                                changeTags(
                                  'tags',
                                  tags.filter(({ id }) => id !== value.id)
                                );
                              }}
                              editable={{
                                set:
                                  hasPermission([PROJECT_UPDATE, PROJECT_SET_TAGS]) &&
                                  hasPermission(TAG_LIST),
                                remove: hasPermission([PROJECT_UPDATE, PROJECT_SET_TAGS]),
                              }}
                              width="100%"
                            />
                          </div>
                        )}
                      </Subscribe>
                    </div>
                  </div>

                  <div className={MilestonesTimelineWrapperStyle}>
                    <Subscribe to={[ProjectMilestonesContainer]}>
                      {({ state: { milestones } }) => (
                        <div className={ProjectCardBodyStyle(milestones.length)}>
                          {milestones.map(milestone => (
                            <MilestoneTimelineItem key={milestone.id} milestone={milestone} />
                          ))}
                        </div>
                      )}
                    </Subscribe>
                  </div>
                </div>

                <div className={TasksInfoWrapperStyle}>
                  <Subscribe to={[ProjectMilestonesContainer]}>
                    {({ taskCount }) => <TaskStatus {...taskCount()} />}
                  </Subscribe>
                </div>
              </>
            );
          }}
        </Subscribe>
      </div>

      <div
        className={ExpandWrapperStyle}
        onClick={() => setIsExpanded(!isExpanded)}
        role="presentation"
      >
        <Icon icon={isExpanded ? 'CHEVRON_DOUBLE_UP' : 'CHEVRON_DOUBLE_DOWN'} />
      </div>
    </>
  );
};

export default ProjectSection;
