// @flow
import React from 'react';

import TimeLineBlock from './components/TimeLineBlock';
import { ProjectCardBodyStyle } from './style';

type Props = {
  milestones: Array<Object>,
};

const MilestoneTimelineChart = ({ milestones }: Props) => {
  return (
    <div className={ProjectCardBodyStyle(milestones.length)}>
      {milestones.map(milestone => (
        <TimeLineBlock key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
};

export default MilestoneTimelineChart;
