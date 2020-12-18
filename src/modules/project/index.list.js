// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Link, navigate } from '@reach/router';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  ProjectFilterConfig,
  ProjectSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { NewButton, BaseButton, ExportButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { PROJECT_CREATE } from 'modules/permission/constants/project';
import ProjectTemplateSelector from 'modules/projectTemplate/list/index.selector';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import ProjectList from './list';
import { projectsExportQuery } from './query';

const ProjectListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'project_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="PROJECT" color="PROJECT" subIcon="CARDS" />

        <Filter config={ProjectFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={ProjectSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(PROJECT_CREATE) && (
          <>
            {/* $FlowFixMe Flow typed is not updated yet */}
            <Link to="/project/new">
              <NewButton />
            </Link>
            <BooleanValue>
              {({ value: isOpen, set: toggleSlide }) => (
                <>
                  <BaseButton
                    icon="ADD"
                    label={
                      <FormattedMessage
                        id="modules.project.newFromTemplate"
                        defaultMessage="FROM TEMPLATE"
                      />
                    }
                    backgroundColor="TEAL"
                    hoverBackgroundColor="TEAL_DARK"
                    onClick={() => toggleSlide(true)}
                  />
                  <SlideView isOpen={isOpen} onRequestClose={() => toggleSlide(false)}>
                    {isOpen && (
                      <ProjectTemplateSelector
                        onCancel={() => toggleSlide(false)}
                        onSave={template => {
                          // $FlowFixMe Flow typed is not updated yet
                          navigate('/project/new', {
                            state: {
                              template: {
                                tags: template.tags,
                                milestones: template.milestones.map(item => ({
                                  ...item,
                                  tasks: [],
                                  files: [],
                                })),
                              },
                            },
                          });
                          toggleSlide(false);
                        }}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </>
        )}
        <ExportButton
          type="Projects"
          exportQuery={projectsExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
          }}
        />
      </NavBar>
      <ProjectList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default ProjectListModule;
