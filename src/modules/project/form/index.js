// @flow

import * as React from 'react';
import { isEquals } from 'utils/fp';
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
      </div>
    );
  }
}
