// @flow

import * as React from 'react';
import { isEquals } from 'utils/fp';
import { SectionWrapper } from 'components/Form';
import ProjectSection from './components/ProjectSection';
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
        <SectionWrapper id="project_projectSection">
          <ProjectSection project={project} isNew={isNew} isClone={isClone} isLoading={loading} />
        </SectionWrapper>
      </div>
    );
  }
}
