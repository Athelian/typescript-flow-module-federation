// @flow
import * as React from 'react';
import type { Milestone } from 'generated/graphql';
import memoize from 'memoize-one';
import { flattenDeep } from 'lodash';
import { Subscribe } from 'unstated';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { calculateBindingDate, injectProjectAndMilestoneDueDate } from 'utils/project';
import ProjectAutoDateBinding from 'modules/task/common/ProjectAutoDateBinding';
import { ProjectInfoContainer, ProjectMilestonesContainer } from 'modules/project/form/containers';
import ProjectSection from './components/ProjectSection';
import MilestonesSection from './components/MilestonesSection';
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

const generateTasks = memoize((milestones: Array<Milestone>, info: Object) => {
  return flattenDeep(
    milestones.map(milestone =>
      injectProjectAndMilestoneDueDate({
        milestoneId: milestone.id,
        tasks: getByPathWithDefault([], 'tasks', milestone),
        projectInfo: {
          ...info,
          milestones: milestones.map(item => {
            const { dueDate: projectDueDate } = info;
            const { dueDate, dueDateBinding, dueDateInterval } = item;
            return {
              id: item.id,
              dueDate: dueDateBinding
                ? calculateBindingDate(projectDueDate, dueDateInterval)
                : dueDate,
            };
          }),
        },
      })
    )
  );
});

export default class ProjectForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { project, isOwner } = this.props;
    return !isEquals(project, nextProps.project) || nextProps.isOwner !== isOwner;
  }

  render() {
    const { isNew, isClone, project, loading } = this.props;

    return (
      <div className={ProjectFormWrapperStyle}>
        <ProjectSection project={project} isNew={isNew} isClone={isClone} isLoading={loading} />
        <MilestonesSection />
        <Subscribe to={[ProjectInfoContainer, ProjectMilestonesContainer]}>
          {({ state: info }, { state: { milestones }, updateTasks }) => (
            <ProjectAutoDateBinding
              tasks={generateTasks(milestones, info)}
              setTaskValue={updateTasks}
            />
          )}
        </Subscribe>
      </div>
    );
  }
}
