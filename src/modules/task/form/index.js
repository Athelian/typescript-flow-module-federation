// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import TaskInfoSection from './components/TaskInfoSection';
import ProjectSection from './components/ProjectSection';
import ParentEntity from './components/ParentEntity';
import { TaskFormWrapperStyle } from './style';
import EntitySection from './components/EntitySection';

type Props = {|
  // eslint-disable-next-line react/no-unused-prop-types
  groupIds: Array<string>,
  task?: Object,
  entity?: Object,
  onFormReady?: () => void,
  parentEntity?: string,
  inParentEntityForm: boolean,
  isInTemplate?: boolean,
  isInProject?: boolean,
|};

const TaskForm = ({
  task,
  entity,
  onFormReady,
  parentEntity,
  inParentEntityForm,
  isInTemplate,
  isInProject,
}: Props) => {
  React.useEffect(() => {
    if (onFormReady) {
      onFormReady();
    }
  }, [onFormReady]);

  return (
    <div className={TaskFormWrapperStyle}>
      <TaskInfoSection
        isInTemplate={isInTemplate}
        isInProject={isInProject}
        parentEntity={parentEntity}
        task={task}
      />

      {!isInTemplate && !isInProject && (
        <ProjectSection parentEntity={entity?.__typename} parentEntityId={task?.ownedBy?.id} />
      )}

      {!isInTemplate && !inParentEntityForm && <EntitySection task={task} entity={entity} />}

      <ParentEntity inParentEntityForm={inParentEntityForm} entity={entity} />
    </div>
  );
};

const memoCheck = (prev: any, next: any): boolean => isEquals(prev.task, next.task);

export default React.memo<Props>(TaskForm, memoCheck);
