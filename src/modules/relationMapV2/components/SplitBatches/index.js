// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH } from 'modules/relationMapV2/constants';
import { SaveButton, CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { Label, NumberInputFactory } from 'components/Form';
import { entitiesUpdateManyMutation } from './mutation';
import { DialogStyle, ButtonsStyle, ConfirmMessageStyle } from './style';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>) => void,
|};

export default function SplitBatches({ onSuccess }: Props) {
  const [tags, setTags] = React.useState([]);
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
  const [updateEntities] = useMutation(entitiesUpdateManyMutation);
  const {
    targets,
    split: { isOpen, isProcessing },
  } = state;
  React.useEffect(() => {
    return () => {
      if (isOpen) setTags([]);
    };
  }, [isOpen]);

  const batchIds = targetedIds(targets, BATCH);

  const onCancel = React.useCallback(() => {
    dispatch({
      type: 'SPLIT_END',
      payload: {},
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (isProcessing) {
      updateEntities({
        variables: {
          batchIds,
        },
      })
        .then(result => {
          onSuccess((result.data?.entitiesUpdateMany?.orders ?? []).map(order => order.id));
        })
        .catch(onCancel);
    }
  }, [batchIds, isProcessing, onCancel, onSuccess, tags, updateEntities]);

  const onConfirm = () => {
    dispatch({
      type: 'SPLIT_START',
      payload: {},
    });
  };

  return (
    <Dialog isOpen={isOpen} width="450px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Split batches <Icon icon="BATCH" />
        </h3>
        {batchIds.map(batchId => (
          <div key={batchId}>
            <div>
              <Label required>
                <FormattedMessage
                  id="components.cards.splitQuantityForBatch"
                  defaultMessage="QTY FOR BATCH"
                />
              </Label>
              <Icon icon="BATCH" /> {mapping.entities?.batches?.[batchId]?.no}
            </div>
            <NumberInputFactory
              name={batchId}
              originalValue={0}
              editable
              inputWidth="200px"
              inputHeight="20px"
            />
          </div>
        ))}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <SaveButton
            isLoading={Boolean(isProcessing)}
            disabled={Boolean(isProcessing) || tags.length === 0}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
