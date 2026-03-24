import { horizontalScale, verticalScale, moderateScale } from '../utils/scaling';
import { Dimensions } from 'react-native';

describe('Scaling Utils', () => {
    const { width, height } = Dimensions.get('window');

    test('horizontalScale should scale based on width', () => {
        const size = 100;
        const expected = (width / 375) * size;
        expect(horizontalScale(size)).toBe(expected);
    });

    test('verticalScale should scale based on height', () => {
        const size = 100;
        const expected = (height / 812) * size;
        expect(verticalScale(size)).toBe(expected);
    });

    test('moderateScale should return a value between base and scaled', () => {
        const size = 100;
        const scaled = horizontalScale(size);
        const result = moderateScale(size);
        
        if (scaled > size) {
            expect(result).toBeGreaterThan(size);
            expect(result).toBeLessThan(scaled);
        } else if (scaled < size) {
            expect(result).toBeLessThan(size);
            expect(result).toBeGreaterThan(scaled);
        } else {
            expect(result).toBe(size);
        }
    });
});
