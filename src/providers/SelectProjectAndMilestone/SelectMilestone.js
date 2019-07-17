// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ObjectValue } from 'react-values';
import type { Milestone } from 'generated/graphql';
import { getByPathWithDefault } from 'utils/fp';
import GridView from 'components/GridView';
import { Content, SlideViewLayout } from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { MilestoneCard } from 'components/Cards';

type Props = {
  onCancel: () => void,
  onSelect: (selectedMilestone: ?Milestone) => void,
  milestone: ?Milestone,
  milestones: Array<Milestone>,
};

function SelectMilestone({ onCancel, onSelect, milestones, milestone }: Props) {
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
            <SaveButton
              data-testid="btnSaveSelectMilestone"
              disabled={
                getByPathWithDefault('', 'id', selectedMilestone) ===
                getByPathWithDefault('', 'id', milestone)
              }
              onClick={() => onSelect(selectedMilestone)}
            />
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
                return (
                  <MilestoneCard
                    key={item.id}
                    milestone={item}
                    onClick={() =>
                      item.id === getByPathWithDefault('', 'id', selectedMilestone)
                        ? setSelectMilestone(null)
                        : setSelectMilestone(item)
                    }
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
