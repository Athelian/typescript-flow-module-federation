// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import { countMaskFieldDefinitions } from 'utils/customFields';
import loadMore from 'utils/loadMore';
import { CUSTOM_FIELD_MASKS_CREATE } from 'modules/permission/constants/customFields';
import { PermissionConsumer } from 'modules/permission';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import { Label } from 'components/Form';
import MaskGridView from 'modules/metadata/components/MaskGridView';
import MaskFormWrapper from 'modules/metadata/components/MaskFormWrapper';
import { masksQuery } from 'modules/metadata/query';
import { TemplateCard } from 'components/Cards';
import { TemplatesListWrapperStyle, TemplatesHeaderStyle, TemplatesBodyStyle } from './style';

type Props = {
  entityType: string,
  queryVariables: Object,
};

const MaskList = ({ entityType, queryVariables }: Props) => (
  <PermissionConsumer>
    {hasPermission => {
      const allowCreate = hasPermission(CUSTOM_FIELD_MASKS_CREATE);

      return (
        <Query
          key={entityType}
          query={masksQuery}
          variables={queryVariables}
          fetchPolicy="network-only"
        >
          {({ loading, data, fetchMore, error, refetch }) => {
            if (error) {
              return error.message;
            }

            const nextPage = getByPathWithDefault(1, 'masks.page', data) + 1;
            const totalPage = getByPathWithDefault(1, 'masks.totalPage', data);
            const hasMore = nextPage <= totalPage;

            return (
              <div className={TemplatesListWrapperStyle}>
                <div className={TemplatesHeaderStyle}>
                  <Label>
                    <FormattedMessage id="modules.metadata.templates" defaultMessage="TEMPLATES" />
                  </Label>
                  {allowCreate && (
                    <BooleanValue>
                      {({ value: isOpen, set: toggle }) => (
                        <>
                          <NewButton onClick={() => toggle(true)} disabled={loading} />
                          <SlideView isOpen={isOpen} onRequestClose={() => toggle(false)}>
                            {isOpen && (
                              <MaskFormWrapper
                                entityType={entityType}
                                isNew
                                onSave={() => {
                                  toggle(false);
                                  refetch();
                                }}
                                onCancel={() => toggle(false)}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  )}
                </div>
                <div className={TemplatesBodyStyle}>
                  <MaskGridView
                    entityType={entityType}
                    items={getByPathWithDefault([], 'masks.nodes', data)}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'masks')}
                    hasMore={hasMore}
                    isLoading={loading}
                    renderItem={mask => (
                      <BooleanValue key={mask.id}>
                        {({ value: isOpen, set: toggle }) => (
                          <>
                            <TemplateCard
                              template={{
                                id: mask.id,
                                title: mask.name,
                                description: mask.memo,
                                count: countMaskFieldDefinitions(mask),
                              }}
                              type="METADATA"
                              onClick={() => {
                                toggle(true);
                              }}
                            />
                            <SlideView isOpen={isOpen} onRequestClose={() => toggle(false)}>
                              {isOpen && (
                                <MaskFormWrapper
                                  entityType={entityType}
                                  id={mask.id}
                                  onSave={() => {
                                    toggle(false);
                                    refetch();
                                  }}
                                  onCancel={() => toggle(false)}
                                />
                              )}
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    )}
                  />
                </div>
              </div>
            );
          }}
        </Query>
      );
    }}
  </PermissionConsumer>
);

export default MaskList;
