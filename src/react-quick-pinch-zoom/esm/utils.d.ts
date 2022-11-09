import { UpdateAction } from './PinchZoom/types';
export declare const isTouch: () => boolean;
export declare const make2dTransformValue: ({ x, y, scale }: UpdateAction) => string;
export declare const make3dTransformValue: ({ x, y, scale }: UpdateAction) => string;
export declare const hasTranslate3DSupport: () => boolean;
