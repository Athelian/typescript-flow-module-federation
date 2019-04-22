import { convertDistance, convertArea } from '../metric';

describe('TEST: metric utils', () => {
  it('convertDistance', () => {
    expect(convertDistance(0, 'cm', 'm')).toEqual(0);
    expect(convertDistance(55, 'cm', 'cm')).toEqual(55);
    expect(convertDistance(55, 'cm', 'm')).toEqual(0.55);
    expect(convertDistance(55, 'm', 'cm')).toEqual(5500);
    expect(convertDistance(0.55, 'm', 'cm')).toEqual(55);
  });

  it('convertArea', () => {
    expect(convertArea(0, 'cm²', 'm²')).toEqual(0);
    expect(convertArea(55, 'cm²', 'cm²')).toEqual(55);
    expect(convertArea(55, 'cm²', 'm²')).toEqual(0.0055);
    expect(convertArea(55, 'm²', 'cm²')).toEqual(550000);
    expect(convertArea(0.55, 'm²', 'cm²')).toEqual(5500);
  });
});
