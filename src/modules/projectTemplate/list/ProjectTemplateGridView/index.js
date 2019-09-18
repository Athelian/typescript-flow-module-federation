// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import ProjectTemplateFormInSlide from 'modules/projectTemplate/form/index.slide';

import { TASK_TEMPLATE_FORM } from 'modules/permission/constants/task';

import { isForbidden } from 'utils/data';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const renderItem = (item: Object, canOpenForm: boolean) => {
  if (isForbidden(item)) {
    return 'forbiddenCard';
  }
  return (
    <BooleanValue key={item.id}>
      {({ value: isOpen, set: toggleSlide }) => (
        <>
          <TemplateCard
            type="PROJECT"
            template={{
              id: item.id,
              title: item.name,
              description: item.description,
            }}
            onClick={() => {
              if (canOpenForm) {
                toggleSlide(true);
              }
              // FIXME: @tj
              toggleSlide(true);
            }}
          />
          <SlideView isOpen={isOpen} onRequestClose={() => toggleSlide(false)}>
            {isOpen && (
              <ProjectTemplateFormInSlide id={item.id} onCancel={() => toggleSlide(false)} />
            )}
          </SlideView>
        </>
      )}
    </BooleanValue>
  );
};

const ProjectTemplateGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => {
  const { hasPermission } = usePermission();
  const canOpenForm = hasPermission([TASK_TEMPLATE_FORM]);

  return (
    <GridView
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.projectTemplate.noTemplate"
          defaultMessage="No template found"
        />
      }
    >
      {items.map(item => renderItem(item, canOpenForm))}
    </GridView>
  );
};

export default ProjectTemplateGridView;
