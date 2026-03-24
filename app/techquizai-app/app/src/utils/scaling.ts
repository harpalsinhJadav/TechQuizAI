import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scale based on screen width
 * @param size size to scale
 * @returns scaled size
 */
export const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;

/**
 * Scale based on screen height
 * @param size size to scale
 * @returns scaled size
 */
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

/**
 * Scale based on screen width with a factor (moderate scaling)
 * @param size size to scale
 * @param factor moderate scaling factor (default 0.5)
 * @returns scaled size
 */
export const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

/**
 * Font scaling
 * @param size font size
 * @returns scaled font size
 */
export const scaleFont = (size: number) => {
  const newSize = size * (width / guidelineBaseWidth);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.getFontScale() * newSize);
  }
  return Math.round(PixelRatio.getFontScale() * newSize) - 2;
};
