// @flow
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { Provider, Subscribe } from 'unstated';
import { Content, SlideViewLayout } from 'components/Layout';
import LoadingIcon from 'components/LoadingIcon';
import { FormContainer } from 'modules/form';
import { uuid } from 'utils/id';
import ProjectTemplateFormHeader from './components/ProjectTemplateFormHeader';
import TemplateInfoSection from './components/TemplateInfoSection';
import ProjectInfoSection from './components/ProjectInfoSection';
import MilestonesSection from './components/MilestonesSection';
import ProjectTemplateContainer from './container';
import { projectTemplateFormQuery } from './query';
import { CommonFormWrapperStyle } from './style';

type Props = {
  id?: string,
  onCancel?: Function,
  onSave?: Function,
};

const ProjectTemplateFormInSlide = ({ id, onCancel, onSave }: Props) => {
  const isNew = !id;
  const [template, setTemplate] = useState({
    id: uuid(),
    milestones: [{ id: uuid(), name: 'milestone 1' }],
  });

  const [loadTemplate, { loading, error, data }] = useLazyQuery(projectTemplateFormQuery, {
    variables: { id },
  });

  useEffect(() => {
    if (!isNew) {
      loadTemplate();
    }
  }, [isNew, loadTemplate]);

  useEffect(() => {
    if (data && data.projectTemplate) {
      setTemplate(data.projectTemplate);
    }
  }, [data]);

  if (loading) {
    return <LoadingIcon />;
  }

  const formContainer = new FormContainer();
  return (
    <Provider inject={[formContainer]}>
      {/* init */}
      <Subscribe to={[ProjectTemplateContainer]}>
        {({ state, initDetailValues }) => {
          if (!state.id) {
            initDetailValues(template);
          }
          return (
            <ProjectTemplateFormHeader
              isNew={isNew}
              id={id}
              onCancel={onCancel}
              onSave={onSave}
              formContainer={formContainer}
              initDetailValues={initDetailValues}
            />
          );
        }}
      </Subscribe>

      <SlideViewLayout>
        {error && error.message}
        <Content>
          <div className={CommonFormWrapperStyle}>
            <TemplateInfoSection />
            <ProjectInfoSection />
            <MilestonesSection />
          </div>
        </Content>
      </SlideViewLayout>
    </Provider>
  );
};

export default React.memo<Props>(ProjectTemplateFormInSlide);
