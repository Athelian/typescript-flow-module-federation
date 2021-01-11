// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { SectionHeader, SectionWrapper, DashedPlusButton } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';
import { MilestoneCard, GrayCard } from 'components/Cards';
import ProjectCard from 'components/Cards/ProjectCard';
import SlideView from 'components/SlideView';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import TaskContainer from 'modules/task/form/container';
import { circleValidator } from 'modules/task/form/validator';
import { checkEditableFromEntity, triggerAutoBinding } from 'utils/task';
import { getByPathWithDefault } from 'utils/fp';
import { ProjectSectionWrapperStyle, ProjectSectionStyle } from './style';

type Props = {
  parentEntity?: string,
};

const ProjectSection = ({ parentEntity }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <SectionWrapper id="task_project_section">
      <SectionHeader
        icon="PROJECT"
        title={<FormattedMessage id="modules.task.project" defaultMessage="Project" />}
      />
      <div className={ProjectSectionWrapperStyle}>
        <SectionNavBar>
          <div id="sortsandfilterswip" />
        </SectionNavBar>

        <Subscribe to={[TaskContainer]}>
          {({ state: values, setFieldValues }) => {
            const { milestone, startDateBinding, dueDateBinding } = values;
            const manualSettings = {
              startDate: !startDateBinding,
              dueDate: !dueDateBinding,
            };
            const entity = getByPathWithDefault(parentEntity, 'entity.__typename', values);

            const hasCircleBindingError = !circleValidator.isValidSync(values);
            const editable = checkEditableFromEntity(entity, hasPermission);
            // console.log('[debug] ');
            return (
              <BooleanValue>
                {({ value: opened, set: toggleSlide }) => (
                  <div className={ProjectSectionStyle}>
                    {milestone ? (
                      <>
                        <ProjectCard
                          project={milestone.project}
                          onClick={() => {
                            if (editable.milestone) {
                              toggleSlide(true);
                            }
                          }}
                        />
                        <MilestoneCard
                          milestone={milestone}
                          onClick={() => {
                            if (editable.milestone) {
                              toggleSlide(true);
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {editable.milestone ? (
                          <DashedPlusButton
                            width="860px"
                            height="150px"
                            onClick={() => toggleSlide(true)}
                          />
                        ) : (
                          <GrayCard width="860px" height="150px" />
                        )}
                      </>
                    )}

                    <SlideView isOpen={opened} onRequestClose={() => toggleSlide(false)}>
                      {opened && (
                        <SelectProjectAndMilestone
                          cacheKey="TaskInfoSectionSelectProjectAndMilestone"
                          milestone={milestone}
                          onSelect={newMilestone => {
                            setFieldValues({
                              milestone: newMilestone,
                            });

                            triggerAutoBinding({
                              manualSettings,
                              values,
                              entity,
                              hasCircleBindingError,
                              task: values,
                            });
                            toggleSlide(false);
                          }}
                          onCancel={() => toggleSlide(false)}
                        />
                      )}
                    </SlideView>
                  </div>
                )}
              </BooleanValue>
            );
          }}
        </Subscribe>
      </div>
    </SectionWrapper>
  );
};

export default ProjectSection;
