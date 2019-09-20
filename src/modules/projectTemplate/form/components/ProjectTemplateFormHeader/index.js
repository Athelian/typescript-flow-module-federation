// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { useMutation } from '@apollo/react-hooks';
import { SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { CancelButton, ResetButton, SaveButton } from 'components/Buttons';
import { resetFormState } from 'modules/form';
import { removeTypename } from 'utils/data';
import { validator } from 'modules/projectTemplate/form/validator';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import {
  projectTemplateCreateMutation,
  projectTemplateUpdateMutation,
  prepareParsedProjectTemplate,
} from 'modules/projectTemplate/form/mutation';

type Props = {
  isNew: boolean,
  id?: string,
  onCancel?: Function,
  onSave?: Function,
  formContainer: Object,
  initDetailValues: Function,
};

const ProjectTemplateFormHeader = ({
  isNew,
  id,
  onCancel,
  onSave,
  formContainer,
  initDetailValues,
}: Props) => {
  const [createProjectTemplate, { data: createRes }] = useMutation(projectTemplateCreateMutation);
  const [updateProjectTemplate, { data: updateRes }] = useMutation(projectTemplateUpdateMutation);

  useEffect(() => {
    if (createRes && createRes.projectTemplate) {
      initDetailValues(createRes.projectTemplate);
    }
  }, [createRes, initDetailValues]);

  useEffect(() => {
    if (updateRes && updateRes.projectTemplateUpdate) {
      initDetailValues(updateRes.projectTemplateUpdate);
    }
  }, [initDetailValues, updateRes]);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {container => {
        return (
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" />
            <JumpToSection>
              <SectionTabs
                link="template_info_section"
                label={<FormattedMessage id="common.template" defaultMessage="Template" />}
                icon="TEMPLATE"
              />

              <SectionTabs
                link="project_info_section"
                label={<FormattedMessage id="common.project" defaultMessage="Project" />}
                icon="PROJECT"
              />

              <SectionTabs
                link="milestones_section"
                label={<FormattedMessage id="common.milestone" defaultMessage="Milestone" />}
                icon="MILESTONE"
              />
            </JumpToSection>

            {isNew && (
              <>
                <CancelButton onClick={onCancel} />
                <SaveButton
                  id="project_template_form_save_button"
                  disabled={
                    !container.isDirty() || !formContainer.isReady(container.state, validator)
                  }
                  onClick={() => {
                    const input = prepareParsedProjectTemplate(
                      null,
                      removeTypename(container.state)
                    );
                    createProjectTemplate({ variables: { input } });
                    setTimeout(() => (onSave ? onSave() : null), 200);
                  }}
                />
              </>
            )}

            {!isNew && container.isDirty() && (
              <>
                <ResetButton
                  onClick={() => {
                    resetFormState(container);
                    formContainer.onReset();
                  }}
                />
                <SaveButton
                  id="project_template_form_save_button"
                  disabled={!formContainer.isReady(container.state, validator)}
                  onClick={() => {
                    const input = prepareParsedProjectTemplate(
                      removeTypename(container.originalValues),
                      removeTypename(container.state)
                    );
                    updateProjectTemplate({ variables: { id, input } });
                    setTimeout(() => (onSave ? onSave() : null), 200);
                  }}
                />
              </>
            )}
          </SlideViewNavBar>
        );
      }}
    </Subscribe>
  );
};

export default ProjectTemplateFormHeader;
