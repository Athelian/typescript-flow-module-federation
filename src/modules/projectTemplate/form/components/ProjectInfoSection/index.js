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
  TextAreaInputFactory,
  TagsInput,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import GridRow from 'components/GridRow';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import {
  PROJECT_TEMPLATE_CREATE,
  PROJECT_TEMPLATE_UPDATE,
  PROJECT_TEMPLATE_SET_TAGS,
} from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';

import {
  ProjectInfoSectionWrapperStyle,
  DescriptionAndTagsWrapperStyle,
  TagsWrapperStyle,
} from './style';

const ProjectInfoSection = () => {
  const { hasPermission } = usePermission();

  const canCreateOrUpdate = hasPermission([PROJECT_TEMPLATE_CREATE, PROJECT_TEMPLATE_UPDATE]);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {({ state: values, setFieldValue }) => {
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
                  <FieldItem
                    vertical
                    label={
                      <Label height="30px" width="200px">
                        <FormattedMessage id="modules.projectTemplate.name" defaultMessage="name" />
                      </Label>
                    }
                    input={
                      <Display color="GRAY" height="30px" width="200px">
                        <FormattedMessage
                          id="modules.projectTemplate.projectName"
                          defaultMessage="project name"
                        />
                      </Display>
                    }
                  />

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
                  <TextAreaInputFactory
                    label={
                      <FormattedMessage id="common.description" defaultMessage="Description" />
                    }
                    vertical
                    inputWidth="420px"
                    inputHeight="80px"
                  />

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
                        setFieldValue('tags', value);
                      }}
                      onClickRemove={value => {
                        setFieldValue('tags', values.tags.filter(({ id }) => id !== value.id));
                      }}
                      editable={{
                        set: canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_TAGS),
                        remove: canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_TAGS),
                      }}
                      width="200px"
                    />
                  </div>
                </div>
              </GridColumn>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
};

export default ProjectInfoSection;
