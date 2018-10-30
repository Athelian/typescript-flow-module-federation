// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { FormattedMessage } from 'react-intl';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import LineNumber from './components/LineNumber';
import HeaderSection from './components/HeaderSection';
import { WrapperStyle } from './style';
import { SortFilter, SortFilterHandler } from '../SortFilter';
import ExpandHeader from '../ExpandHeader';
import ToggleTag from '../ToggleTag';
import SummaryBadge from '../SummaryBadge';

type Props = {
  onSave: () => void,
  onCancel: () => void,
  onExpand: () => void,
};

export default function TableInlineEdit({ onSave, onCancel, onExpand }: Props) {
  return (
    <Layout
      navBar={
        <SlideViewNavBar>
          <EntityIcon icon="ORDER" color="ORDER" />
          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </SlideViewNavBar>
      }
    >
      <HeaderSection isShowAll />
      <div>
        <SortFilterHandler>
          {({ sort, filter, onChangeSortFilter }) => (
            <SortFilter sort={sort} filter={filter} onChange={onChangeSortFilter} />
          )}
        </SortFilterHandler>
        <ToggleTag />
      </div>
      <div className={WrapperStyle}>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="ORDER"
            color="ORDER"
            label={<FormattedMessage {...messages.ordersLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            label={<FormattedMessage {...messages.itemsLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="BATCH"
            color="BATCH"
            label={<FormattedMessage {...messages.batchesLabel} />}
            no={0}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <SummaryBadge
            icon="SHIPMENT"
            color="SHIPMENT"
            label={<FormattedMessage {...messages.shipmentsLabel} />}
            no={0}
          />
        </ExpandHeader>
      </div>
      <div>
        <LineNumber /> Main Content
      </div>
    </Layout>
  );
}
