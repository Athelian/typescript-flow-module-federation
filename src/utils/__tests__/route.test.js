import { parseRoute } from '../route';

describe('utils of route', () => {
  it('parse all route', () => {
    expect(parseRoute('order')).toEqual('order');
    expect(parseRoute('orderItem')).toEqual('order-item');
    expect(parseRoute('batch')).toEqual('batch');
    expect(parseRoute('shipment')).toEqual('shipment');
    expect(parseRoute('container')).toEqual('container');
    expect(parseRoute('product')).toEqual('product');
    expect(parseRoute('task')).toEqual('task');
    expect(parseRoute('warehouse')).toEqual('warehouse');
    expect(parseRoute('tag')).toEqual('tag');
  });
});
