// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { SectionWrapper, DashedPlusButton } from 'components/Form';

import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import MilestoneColumn from './MilestoneColumn';

const MilestonesSection = () => {
  const handleDragEnd = () => {};

  return (
    <SectionWrapper id="milestones_section">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="project_template_form_milestones"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping
        >
          {dropProvided => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              <Subscribe to={[ProjectTemplateContainer]}>
                {({
                  state: {
                    project: { milestones = [] },
                  },
                }) => {
                  return (
                    <>
                      {milestones.map((item, index) => (
                        <MilestoneColumn key={item.id} id={item.id} index={index} draggable />
                      ))}
                      {dropProvided.placeholder}

                      <DashedPlusButton
                        width="195px"
                        height="140px"
                        onClick={() => {
                          console.debug('create a milestone');
                        }}
                      />
                    </>
                  );
                }}
              </Subscribe>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </SectionWrapper>
  );
};

export default MilestonesSection;
