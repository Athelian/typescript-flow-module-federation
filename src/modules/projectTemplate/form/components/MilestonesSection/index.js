// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { SectionWrapper, SectionHeader, DashedPlusButton } from 'components/Form';

import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import { uuid } from 'utils/id';

import MilestoneColumn from './MilestoneColumn';
import { MilestonesSectionWrapperStyle, PlusButtonStyle } from './style';

const MilestonesSection = () => {
  return (
    <SectionWrapper id="milestones_section">
      <SectionHeader
        icon="MILESTONE"
        title={
          <FormattedMessage id="modules.projectTemplate.milestones" defaultMessage="milestones" />
        }
      />
      <Subscribe to={[ProjectTemplateContainer]}>
        {({ state: { milestones = [] }, setFieldValue }) => {
          const handleDragEnd = ({ destination, source }) => {
            if (!destination) {
              return;
            }
            if (destination.index === source.index) {
              return;
            }
            const reorder = [...milestones];
            const [removed] = reorder.splice(source.index, 1);
            reorder.splice(destination.index, 0, removed);

            setFieldValue('milestones', reorder);
          };

          return (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="project_template_form_milestones"
                type="COLUMN"
                direction="horizontal"
                ignoreContainerClipping
              >
                {dropProvided => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    className={MilestonesSectionWrapperStyle}
                  >
                    {milestones.map((item, index) => (
                      <MilestoneColumn key={item.id} id={item.id} index={index} draggable />
                    ))}
                    {dropProvided.placeholder}
                    <div className={PlusButtonStyle}>
                      <DashedPlusButton
                        width="195px"
                        height="140px"
                        onClick={() => {
                          setFieldValue('milestones', [
                            ...milestones,
                            {
                              id: uuid(),
                              name: `milestone ${milestones.length + 1}`,
                            },
                          ]);
                        }}
                      />
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
};

export default MilestonesSection;
