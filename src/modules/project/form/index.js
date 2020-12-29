// @flow
import * as React from 'react';
// import type { Milestone } from 'generated/graphql';
// import memoize from 'memoize-one';
// import { flattenDeep } from 'lodash';
// import { Subscribe } from 'unstated';
import {
  isEquals,
  // getByPathWithDefault
} from 'utils/fp';
// import { calculateBindingDate } from 'utils/date';
// import { injectProjectAndMilestoneDueDate } from 'utils/project';
// import { ProjectInfoContainer, ProjectMilestonesContainer } from 'modules/project/form/containers';
import { UserConsumer } from 'contexts/Viewer';
import ProjectSection from './components/ProjectSection';
import MilestonesSection from './components/MilestonesSection';
// import ProjectAutoDateBinding from './components/ProjectAutoDateBinding';
import { ProjectFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  loading: boolean,
  isClone: boolean,
  isOwner: boolean,
  project: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  isOwner: true,
  loading: false,
  project: {},
};

// const generateTasks = memoize((milestones: Array<Milestone>, info: Object, timezone: string) => {
//   return flattenDeep(
//     milestones.map(milestone =>
//       injectProjectAndMilestoneDueDate({
//         milestoneId: milestone.id,
//         tasks: getByPathWithDefault([], 'tasks', milestone),
//         projectInfo: {
//           ...info,
//           milestones: milestones.map(item => {
//             const { dueDate: projectDueDate } = info;
//             const { dueDate, dueDateBinding, dueDateInterval } = item;
//             return {
//               id: item.id,
//               dueDate: dueDateBinding
//                 ? calculateBindingDate(projectDueDate, dueDateInterval, timezone)
//                 : dueDate,
//             };
//           }),
//         },
//       })
//     )
//   );
// });

export default class ProjectForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { project, isOwner } = this.props;
    return !isEquals(project, nextProps.project) || nextProps.isOwner !== isOwner;
  }

  render() {
    const { isNew, isClone, project, loading } = this.props;

    return (
      <UserConsumer>
        {() => (
          <div className={ProjectFormWrapperStyle}>
            <ProjectSection project={project} isNew={isNew} isClone={isClone} isLoading={loading} />
            <MilestonesSection />
            {/* FIXME: project form is normal from, project > milestone > task, don't need this. if have time, refactor */}
            {/* <Subscribe to={[ProjectInfoContainer, ProjectMilestonesContainer]}>
              {(
                { state: latestProject },
                { state: { milestones }, setFieldValue, updateTasks }
              ) => (
                <ProjectAutoDateBinding
                  project={latestProject}
                  milestones={milestones}
                  updateMilestones={setFieldValue}
                  tasks={generateTasks(milestones, latestProject, user.timezone)}
                  setTaskValue={updateTasks}
                />
              )}
            </Subscribe> */}
          </div>
        )}
      </UserConsumer>
    );
  }
}
