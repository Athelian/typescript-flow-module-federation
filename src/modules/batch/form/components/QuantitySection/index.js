// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import {
  BATCH_UPDATE,
  BATCH_SET_QUANTITY_ADJUSTMENTS,
  BATCH_SET_QUANTITY,
} from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import BatchFormContainer from 'modules/batch/form/containers';
import { Tooltip } from 'components/Tooltip';
import { NewButton } from 'components/Buttons';
import { injectUid } from 'utils/id';
import { FormField, FormContainer } from 'modules/form';
import {
  SectionHeader,
  SectionWrapper,
  DefaultAdjustmentStyle,
  NumberInputFactory,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import validator from 'modules/batch/form/validator';
import Diff from './Diff';
import {
  QuantitySectionWrapperStyle,
  AddAdjustmentButtonWrapperStyle,
  QuantityRevisionItemStyle,
  QuantityRevisionDiffStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const QuantitySection = ({ isNew }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(BATCH_UPDATE);

  return (
    <SectionWrapper id="batch_quantitySection">
      <SectionHeader
        icon="QUANTITY_ADJUSTMENTS"
        title={<FormattedMessage id="modules.Batches.quantity" defaultMessage="QUANTITY" />}
      />
      <div className={QuantitySectionWrapperStyle}>
        <Subscribe to={[FormContainer]}>
          {({ setFieldTouched }) => (
            <Subscribe to={[BatchFormContainer]}>
              {({
                originalValues,
                state,
                setFieldArrayValue,
                removeArrayItem,
                calculatePackageQuantity,
              }) => {
                const values = { ...originalValues, ...state };

                const { quantity, batchQuantityRevisions = [] } = values;

                return (
                  <GridColumn gap="10px">
                    <FormField
                      name="quantity"
                      initValue={quantity}
                      setFieldValue={setFieldArrayValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <NumberInputFactory
                          name={name}
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            setFieldArrayValue('quantity', inputHandlers.value);
                            calculatePackageQuantity(setFieldTouched);
                          }}
                          isNew={isNew}
                          required
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Batches.initialQuantity"
                              defaultMessage="INITIAL QUANTITY"
                            />
                          }
                          editable={hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY])}
                        />
                      )}
                    </FormField>

                    {batchQuantityRevisions &&
                      batchQuantityRevisions.map((item, index) => (
                        <div key={item.id} className={QuantityRevisionItemStyle}>
                          <DefaultAdjustmentStyle
                            editable={allowUpdate || hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS)}
                            isNew={isNew}
                            index={index}
                            adjustment={item}
                            setFieldArrayValue={setFieldArrayValue}
                            removeArrayItem={targetName => {
                              removeArrayItem(targetName);
                              calculatePackageQuantity(setFieldTouched);
                            }}
                            enumType="BatchQuantityRevisionType"
                            targetName="batchQuantityRevisions"
                            typeName="type"
                            memoName="memo"
                            valueInput={
                              <FormField
                                name={`batchQuantityRevisions.${index}.quantity`}
                                initValue={item.quantity}
                                setFieldValue={setFieldArrayValue}
                              >
                                {({ name, ...inputHandlers }) => (
                                  <>
                                    <NumberInputFactory
                                      name={name}
                                      {...inputHandlers}
                                      onBlur={evt => {
                                        inputHandlers.onBlur(evt);
                                        setFieldArrayValue(name, inputHandlers.value);
                                        calculatePackageQuantity(setFieldTouched);
                                      }}
                                      isNew={isNew}
                                      originalValue={item.quantity}
                                      editable={
                                        allowUpdate || hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS)
                                      }
                                    />
                                  </>
                                )}
                              </FormField>
                            }
                          />
                          <div className={QuantityRevisionDiffStyle}>
                            {index === 0 && <Diff before={quantity} after={item.quantity} />}
                            {index > 0 && index < 5 && (
                              <Diff
                                before={batchQuantityRevisions[index - 1].quantity}
                                after={item.quantity}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    {(allowUpdate || hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS)) && (
                      <div className={AddAdjustmentButtonWrapperStyle}>
                        {batchQuantityRevisions.length < 5 ? (
                          <NewButton
                            data-testid="btnNewQuantity"
                            label={
                              <FormattedMessage
                                id="modules.Batches.newQuantity"
                                defaultMessage="NEW QUANTITY"
                              />
                            }
                            onClick={() => {
                              setFieldArrayValue(
                                `batchQuantityRevisions[${batchQuantityRevisions.length}]`,
                                injectUid({
                                  isNew: true,
                                  type: 'Other',
                                  quantity:
                                    batchQuantityRevisions.length === 0
                                      ? quantity
                                      : batchQuantityRevisions[batchQuantityRevisions.length - 1]
                                          .quantity,
                                  memo: '',
                                  updatedAt: new Date(),
                                })
                              );
                              calculatePackageQuantity(setFieldTouched);
                            }}
                          />
                        ) : (
                          <Tooltip
                            message={
                              <FormattedMessage
                                id="modules.batch.batchQuantityRevisionMaxMessage"
                                defaultMessage="Only a maximum of 5 new quantities is allowed."
                              />
                            }
                          >
                            <div>
                              <NewButton
                                label={
                                  <FormattedMessage
                                    id="modules.Batches.newQuantity"
                                    defaultMessage="NEW QUANTITY"
                                  />
                                }
                                disabled
                              />
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </GridColumn>
                );
              }}
            </Subscribe>
          )}
        </Subscribe>
      </div>
    </SectionWrapper>
  );
};

export default QuantitySection;
