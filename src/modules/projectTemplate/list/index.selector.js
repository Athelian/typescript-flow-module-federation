// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ObjectValue } from 'react-values';
import { SlideViewLayout, SlideViewNavBar, Content } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { TemplateCard } from 'components/Cards';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { projectTemplateWholeInfoListQuery } from './query';
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

type Props = {
  onCancel: Function,
  onSave: Function,
};

const ProjectTemplateSelector = ({ onCancel, onSave }: Props) => {
  const { queryVariables } = useFilter(initFilter, `filterProjectTemplate`);

  const { loading, error, data, fetchMore } = useQuery(projectTemplateWholeInfoListQuery, {
    variables: queryVariables,
  });

  const nextPage = (data?.projectTemplates.page || 1) + 1;
  const totalPage = data?.projectTemplates?.totalPage || 1;
  const hasMore = nextPage <= totalPage;

  return (
    <ObjectValue>
      {({ value, set }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" subIcon="PROJECT" />
            <CancelButton onClick={onCancel} />
            <SaveButton disabled={!value?.id} onClick={() => onSave(value)} />
          </SlideViewNavBar>
          {error && error.message}

          <Content>
            <ProjectTemplateGridView
              items={data?.projectTemplates?.nodes || []}
              onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'projectTemplates')}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={item => (
                <TemplateCard
                  key={item.id}
                  type="MILESTONE"
                  template={{
                    ...item,
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    count: item.milestones?.length || 0,
                  }}
                  selectable
                  selected={item.id === value?.id}
                  onSelect={() => {
                    if (item.id === value?.id) {
                      set(null);
                    } else {
                      set(item);
                    }
                  }}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </ObjectValue>
  );
};
export default ProjectTemplateSelector;
