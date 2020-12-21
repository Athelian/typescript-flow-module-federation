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
import GridColumn from 'components/GridColumn';
import FormattedName from 'components/FormattedName';
import { renderPartners } from 'modules/warehouse/form/components/WarehouseSection/helpers';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import { BooleanValue } from 'react-values';
import {
  FieldItem,
  Label,
  TagsInput,
  TextInputFactory,
  TextAreaInputFactory,
  DateInputFactory,
  Display,
  StatusToggle,
  FormTooltip,
} from 'components/Form';
import SlideView from 'components/SlideView';
import FormattedNumber from 'components/FormattedNumber';
import SelectPartners from 'components/SelectPartners';
import FormattedDate from 'components/FormattedDate';
import {
  PROJECT_UPDATE,
  PROJECT_SET_NAME,
  PROJECT_SET_DESCRIPTION,
  PROJECT_SET_DUE_DATE,
  PROJECT_SET_TAGS,
  PROJECT_SET_ARCHIVED,
} from 'modules/permission/constants/project';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ProjectActivateDialog, ProjectArchiveDialog } from 'modules/project/common/Dialog';
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
const ProjectSection = ({ isNew, project }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { archived = false } = project || {};
  const allowUpdate = hasPermission(PROJECT_UPDATE);

  return (
    <>
      <div className={ProjectSectionWrapperStyle(isExpanded)}>
        <Subscribe to={[ProjectInfoContainer]}>
          {({ originalValues: initialValues, state, setFieldValue }) => {
            const values = { ...initialValues, ...state };

            const ownedBy = values?.ownedBy?.name || '';

            return (
              <>
                <div className={MainSectionWrapperStyle}>
                  <div className={ProjectInfoWrapperStyle}>
                    <GridRow gap="40px">
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
                              editable={hasPermission([PROJECT_UPDATE, PROJECT_SET_NAME])}
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
                              inputAlign="left"
                              handleTimezone
                            />
                          )}
                        </FormField>
                        {/* TODO: placeholder for custom fields */}
                        {/* <CustomFieldsFactory
                          entityType="Order"
                          customFields={values.customFields}
                          setFieldValue={setFieldValue}
                          editable={{ 
                            values: hasPermission([ORDER_UPDATE, ORDER_SET_CUSTOM_FIELDS]),
                            mask: hasPermission([ORDER_UPDATE, ORDER_SET_CUSTOM_FIELDS_MASK]),
                          }}
                        /> */}

                        <Subscribe to={[ProjectMilestonesContainer]}>
                          {({ lastMilestoneDueDate }) => (
                            <FieldItem
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
                        <div className={DescriptionTagsWrapperStyle}>
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
                      </GridColumn>
                      <GridColumn>
                        <div>
                          {!isNew && (
                            <BooleanValue>
                              {({ value: isDialogOpen, set: dialogToggle }) => (
                                <StatusToggle
                                  readOnly={
                                    !hasPermission(PROJECT_UPDATE) &&
                                    !hasPermission(PROJECT_SET_ARCHIVED)
                                  }
                                  archived={archived}
                                  openStatusDialog={() => dialogToggle(true)}
                                  activateDialog={
                                    <ProjectActivateDialog
                                      project={project}
                                      isOpen={isDialogOpen && !!archived}
                                      onRequestClose={() => dialogToggle(false)}
                                    />
                                  }
                                  archiveDialog={
                                    <ProjectArchiveDialog
                                      project={project}
                                      isOpen={isDialogOpen && !archived}
                                      onRequestClose={() => dialogToggle(false)}
                                    />
                                  }
                                />
                              )}
                            </BooleanValue>
                          )}
                        </div>
                        {/* owner field */}
                        {ownedBy && (
                          <FieldItem
                            vertical
                            label={
                              <Label height="30px">
                                <FormattedMessage {...messages.owner} />
                              </Label>
                            }
                            input={
                              <Display height="30px" align="left" width="200px">
                                <FormattedName firstName={ownedBy} />
                              </Display>
                            }
                          />
                        )}

                        {/* the shared partners */}
                        <FieldItem
                          vertical
                          label={
                            <Label>
                              <FormattedMessage {...messages.sharedPartners} />
                              {' ('}
                              <FormattedNumber value={values.organizations?.length || 0} />)
                            </Label>
                          }
                          tooltip={
                            <FormTooltip
                              infoMessage={<FormattedMessage {...messages.sharedPartnersTooltip} />}
                            />
                          }
                          input={
                            <BooleanValue>
                              {({ value: opened, set: slideToggle }) => (
                                <>
                                  <div
                                    onClick={
                                      hasPermission(PARTNER_LIST) && allowUpdate
                                        ? () => slideToggle(true)
                                        : () => {}
                                    }
                                    role="presentation"
                                  >
                                    {renderPartners(values.organizations || [], allowUpdate)}
                                  </div>
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={() => slideToggle(false)}
                                  >
                                    {opened && (
                                      <SelectPartners
                                        partnerTypes={[]}
                                        selected={values.organizations.map(org => org?.partner)}
                                        onCancel={() => slideToggle(false)}
                                        onSelect={selected => {
                                          const assembledOrgs = selected.map(
                                            ({ organization: org, ...partner }) => ({
                                              ...org,
                                              partner: {
                                                ...partner,
                                              },
                                            })
                                          );
                                          slideToggle(false);
                                          setFieldValue('organizations', assembledOrgs);
                                        }}
                                      />
                                    )}
                                  </SlideView>
                                </>
                              )}
                            </BooleanValue>
                          }
                        />
                      </GridColumn>
                    </GridRow>
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
