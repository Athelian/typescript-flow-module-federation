// @flow
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Link, navigate } from '@reach/router';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import { NewButton, BaseButton, ExportButton } from 'components/Buttons';
import { PROJECT_CREATE } from 'modules/permission/constants/project';
import FilterToolBar from 'components/common/FilterToolBar';
import SlideView from 'components/SlideView';
import ProjectTemplateSelector from 'modules/projectTemplate/list/index.selector';
import usePermission from 'hooks/usePermission';
import useFilter from 'hooks/useFilter';
import ProjectList from './list';
import messages from './messages';
import { projectsExportQuery } from './query';

type Props = {
  intl: IntlShape,
};

const getInitFilter = () => {
  const state = {
    filter: {
      query: '',
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };
  return state;
};

const ProjectListModule = (props: Props) => {
  const { intl } = props;
  const { hasPermission } = usePermission();

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
  ];

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(),
    'filterProject'
  );

  return (
    <Content>
      <NavBar>
        <FilterToolBar
          icon="PROJECT"
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canSearch
        />
        {hasPermission(PROJECT_CREATE) && (
          <>
            <Link to="new">
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
                          navigate('/project/new', { state: { template } });
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
            filterBy: filterAndSort.filter,
            sortBy: {
              [filterAndSort.sort.field]: filterAndSort.sort.direction,
            },
          }}
        />
      </NavBar>
      <ProjectList {...queryVariables} />
    </Content>
  );
};

export default injectIntl(ProjectListModule);
