// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import {
  SectionWrapper,
  SectionHeader,
  FieldItem,
  Label,
  Display,
  TextInputFactory,
  TextAreaInputFactory,
  TagsInput,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import { validator } from 'modules/projectTemplate/form/validator';
import { FormField } from 'modules/form';
import usePermission from 'hooks/usePermission';
import { TASK_TEMPLATE_UPDATE } from 'modules/permission/constants/task';
import {
  ProjectInfoSectionWrapperStyle,
  DescriptionAndTagsWrapperStyle,
  TagsWrapperStyle,
} from './style';

const ProjectInfoSection = () => {
  const { hasPermission } = usePermission();
  // FIXME: @tj
  const canUpdate = hasPermission(TASK_TEMPLATE_UPDATE);
  console.debug(canUpdate);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {({ originalValues, state: values, setFieldValue }) => {
        // const { milestones } = values;
        return (
          <SectionWrapper id="project_info_section">
            <SectionHeader
              icon="PROJECT"
              title={
                <FormattedMessage id="modules.projectTemplate.project" defaultMessage="Project" />
              }
            />

            <div className={ProjectInfoSectionWrapperStyle}>
              <GridColumn>
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
                        required
                        originalValue={originalValues[name]}
                        label={<FormattedMessage id="common.name" defaultMessage="Project Name" />}
                        // FIXME: @tj
                        editable
                        vertical
                        inputAlign="left"
                      />
                    )}
                  </FormField>

                  <FieldItem
                    vertical
                    label={
                      <Label height="30px" width="200px">
                        <FormattedMessage
                          id="modules.projectTemplate.projectDueDate"
                          defaultMessage="Project Due Date"
                        />
                      </Label>
                    }
                    input={
                      <Display color="GRAY" height="30px" width="200px">
                        <FormattedMessage id="common.datePlaceholder" defaultMessage="yyyy/mm/dd" />
                      </Display>
                    }
                  />

                  <FieldItem
                    vertical
                    label={
                      <Label height="30px" width="200px">
                        <FormattedMessage
                          id="modules.projectTemplate.lastMilestoneDueDate"
                          defaultMessage="Last Milestone Due Date"
                        />
                      </Label>
                    }
                    input={
                      <Display color="GRAY" height="30px" width="200px">
                        <FormattedMessage id="common.datePlaceholder" defaultMessage="yyyy/mm/dd" />
                      </Display>
                    }
                  />
                </GridRow>
                <div className={DescriptionAndTagsWrapperStyle}>
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
                          <FormattedMessage id="common.description" defaultMessage="Description" />
                        }
                        // FIXME: @tj
                        editable
                        vertical
                        inputWidth="420px"
                        inputHeight="80px"
                      />
                    )}
                  </FormField>

                  <div className={TagsWrapperStyle}>
                    <Label height="30px">
                      <FormattedMessage id="common.tags" defaultMessage="Tags" />
                    </Label>

                    <TagsInput
                      id="tags"
                      name="tags"
                      tagType="Project"
                      values={values.tags}
                      onChange={value => {
                        // changeTags('tags', value);
                        console.debug(value);
                      }}
                      onClickRemove={value => {
                        console.debug(value);
                        // changeTags('tags', tags.filter(({ id }) => id !== value.id));
                      }}
                      editable={{
                        set: true,
                        remove: true,
                        // set:
                        //   hasPermission([PROJECT_UPDATE, PROJECT_SET_TAGS]) &&
                        //   hasPermission(TAG_LIST),
                        // remove: hasPermission([PROJECT_UPDATE, PROJECT_SET_TAGS]),
                      }}
                      width="100%"
                    />
                  </div>
                </div>
              </GridColumn>
              {/* FIXME: @tj */}
              {/* <div className={MilestonesTimelineWrapperStyle}>
                <div className={ProjectCardBodyStyle(milestones.length)}>
                  {milestones.map(milestone => (
                    <MilestoneTimelineItem key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div> */}
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};

export default ProjectInfoSection;
