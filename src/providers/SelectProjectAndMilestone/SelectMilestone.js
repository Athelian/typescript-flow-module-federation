// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ObjectValue } from 'react-values';
import type { Milestone } from 'generated/graphql';
import { getByPathWithDefault } from 'utils/fp';
import GridView from 'components/GridView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { MilestoneCard } from 'components/Cards';
import { Tooltip } from 'components/Tooltip';

import { DisabledMilestoneCardStyle } from './style';

type Props = {
  onCancel: () => void,
  onSelect: (selectedMilestone: ?Milestone) => void,
  milestone: ?Milestone,
  milestones: Array<Milestone>,
  saveOnSelect?: boolean,
};

function SelectMilestone({
  onCancel,
  onSelect,
  saveOnSelect = false,
  milestones,
  milestone,
}: Props) {
  return (
    <ObjectValue defaultValue={milestone}>
      {({ value: selectedMilestone, set: setSelectMilestone }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="MILESTONE" color="MILESTONE" />
            <CancelButton
              onClick={() => {
                onCancel();
                setSelectMilestone(milestone);
              }}
            />
            {!saveOnSelect && (
              <SaveButton
                id="select_milestone_save_button"
                data-testid="btnSaveSelectMilestone"
                disabled={
                  getByPathWithDefault('', 'id', selectedMilestone) ===
                  getByPathWithDefault('', 'id', milestone)
                }
                onClick={() => onSelect(selectedMilestone)}
              />
            )}
          </SlideViewNavBar>

          <Content>
            <GridView
              items={milestones}
              hasMore={false}
              isLoading={false}
              isEmpty={milestones.length === 0}
              onLoadMore={() => {}}
              emptyMessage={
                <FormattedMessage
                  id="modules.Milestones.noFound"
                  defaultMessage="No milestone found"
                />
              }
              itemWidth="195px"
            >
              {milestones.map(item => {
                if (
                  item.taskCount.count >= 5 &&
                  item.id !== getByPathWithDefault('', 'id', selectedMilestone)
                ) {
                  return (
                    <div className={DisabledMilestoneCardStyle}>
                      <MilestoneCard key={item.id} milestone={item} selectable={false} />
                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.Milestones.taskLimit"
                            defaultMessage="There is a limit of 5 tasks"
                          />
                        }
                      >
                        <div className="tooltip-box" />
                      </Tooltip>
                    </div>
                  );
                }
                return (
                  <MilestoneCard
                    key={item.id}
                    milestone={item}
                    onClick={() => {
                      if (saveOnSelect) {
                        setSelectMilestone(item);
                        onSelect(item);
                      } else {
                        setSelectMilestone(
                          item.id === getByPathWithDefault('', 'id', selectedMilestone)
                            ? null
                            : item
                        );
                      }
                    }}
                    selectable
                    selected={item.id === getByPathWithDefault('', 'id', selectedMilestone)}
                  />
                );
              })}
            </GridView>
          </Content>
        </SlideViewLayout>
      )}
    </ObjectValue>
  );
}

export default SelectMilestone;
