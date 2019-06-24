// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ProjectInfoContainer,
  ProjectTagsContainer,
  // ProjectMilestonesContainer,
} from 'modules/project/form/containers';
import validator from 'modules/project/form/validator';
import { FormField } from 'modules/form';
import GridColumn from 'components/GridColumn';
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
import { ProjectSectionWrapperStyle, MainFieldsWrapperStyle } from './style';

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
                </GridColumn>
                <GridColumn>Total tasks</GridColumn>
                <GridColumn>Binding entity</GridColumn>
              </div>
            </>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default ProjectSection;
