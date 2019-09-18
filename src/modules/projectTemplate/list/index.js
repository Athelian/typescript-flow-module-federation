// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { BooleanValue } from 'react-values';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { projectTemplateListQuery } from './query';
import ProjectTemplateGridView from './ProjectTemplateGridView';

const initFilter = {
  filter: {},
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
};

const ProjectTemplateListPage = () => {
  const { queryVariables } = useFilter(initFilter, `filterTaskTemplate`);

  const { loading, error, data, fetchMore } = useQuery(projectTemplateListQuery, {
    variables: queryVariables,
  });

  const nextPage = (data?.projectTemplates.page || 1) + 1;
  const totalPage = data?.projectTemplates?.totalPage || 1;
  const hasMore = nextPage <= totalPage;

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
        <BooleanValue>
          {({ value: isOpen, set: toggleSlide }) => (
            <>
              <NewButton onClick={() => toggleSlide(true)} />
              <SlideView isOpen={isOpen} onRequestClose={() => toggleSlide(false)}>
                {isOpen && 'form page'}
              </SlideView>
            </>
          )}
        </BooleanValue>
      </NavBar>
      {error && error.message}

      <ProjectTemplateGridView
        items={data?.projectTemplates?.nodes || []}
        onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'projectTemplates')}
        hasMore={hasMore}
        isLoading={loading}
      />
    </Content>
  );
};
export default ProjectTemplateListPage;
