// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';

import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';

import ProjectTemplateFormInSlide from 'modules/projectTemplate/form/index.slide';
import { PROJECT_TEMPLATE_FORM } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (item: Object, canOpenForm: boolean) => {
  return (
    <BooleanValue key={item.id}>
      {({ value: isOpen, set: toggleSlide }) => (
        <>
          <TemplateCard
            type="MILESTONE"
            template={{
              ...item,
              id: item.id,
              title: item.name,
              description: item.description,
              count: item.milestones?.length || 0,
            }}
            onClick={() => {
              if (canOpenForm) {
                toggleSlide(true);
              }
            }}
          />
          <SlideView
            isOpen={isOpen}
            onRequestClose={() => toggleSlide(false)}
            targetId="project_template_form_save_button"
          >
            {isOpen && (
              <ProjectTemplateFormInSlide id={item.id} onSave={() => toggleSlide(false)} />
            )}
          </SlideView>
        </>
      )}
    </BooleanValue>
  );
};

const ProjectTemplateGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
  const { hasPermission } = usePermission();
  const canOpenForm = hasPermission([PROJECT_TEMPLATE_FORM]);

  return (
    <GridView
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.projectTemplate.noTemplateFound"
          defaultMessage="No template found"
        />
      }
    >
      {items.map(item => renderItem(item, canOpenForm))}
    </GridView>
  );
};

export default ProjectTemplateGridView;
