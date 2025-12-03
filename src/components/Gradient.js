import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';



// Commented out version with skia (uncomment when ready):
import { Dimensions, StyleSheet } from "react-native";
import { Blur, Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";

const { width, height } = Dimensions.get("screen");







const VISUAL_CONFIG = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 2,

  },
};



// ab radiys ka scalling conmfog banengey 


const RADIUS_CONFIG = {
  minScale: 0.6, maxScale: 1.4, speakingScale: 5.0, quietScale: 0.6,
  baseRadius: {
    default: width,
    speaking: width / 4,
  },
}


const ANIMATION_CONFIG = {
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },

  // bouncy ka animation karega ye 

  spring: {
    damping: 10,
    stiffness: 50,
  },

}




// position --> [top , botton , centre ] and isSpeaking --> boolean   


function getTargetY(pos) {
  switch (pos) {
    case "top": return 0;
    case "bottom": return height;
    case "center": return height / 2;
    default: return height / 2;
  }
}



const calculateRadiusBounds = (baseRadius) => {
  "worklet"
  return {
    min: baseRadius * RADIUS_CONFIG.minScale,
    max: baseRadius * RADIUS_CONFIG.maxScale,


  }
}


function calculateTargetRadius(baseRadius, isSpeaking) {
  "worklet"
  const { min, max } = calculateRadiusBounds(baseRadius)
  const scale = isSpeaking ? RADIUS_CONFIG.speakingScale : RADIUS_CONFIG.quietScale
  return min + (max - min) * scale
}

const Colors = {
  white: "#FFFFFF",
  teal: "#5AC8FA",
  mediumBlue: "#007AFF",
  lightBlue: "#4DA6FF",
  iceBlue: "#E6F3FF",
}

const Gradient = React.memo(({ position, isSpeaking }) => {
  const animatedY = useSharedValue(getTargetY(position));

  // gradient radio button ka size apan chnage karenge 

  const radiusScale = useSharedValue(RADIUS_CONFIG.quietScale);
  const baseRadiusValue = useSharedValue(RADIUS_CONFIG.baseRadius.default);
  const mountRadius = useSharedValue(0);

  const centre = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusBounds(baseRadiusValue.value)
    const calculatedRadius = min + (max - min) * radiusScale.value

    return mountRadius.value < calculatedRadius ? mountRadius.value : calculatedRadius;
  });


  // Initial mount animation
  useEffect(() => {
    const targetRadius = calculateTargetRadius(RADIUS_CONFIG.baseRadius.default, false);
    mountRadius.value = withTiming(targetRadius, { duration: ANIMATION_CONFIG.durations.MOUNT })
  }, [])


  // Handle speaking state changes
  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION


    if (isSpeaking) {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking, { duration });
      animatedY.value = withTiming(getTargetY("center"), { duration });
      radiusScale.value = withRepeat(
        withTiming(RADIUS_CONFIG.speakingScale, { duration: ANIMATION_CONFIG.durations.PULSE }),
        -1,
        true
      );
    } else {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default, { duration });
      animatedY.value = withTiming(getTargetY(position), { duration });
      radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, { duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION });
    }
  }, [isSpeaking, position]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={centre}
            r={animatedRadius}
            colors={[Colors.mediumBlue, Colors.lightBlue, Colors.teal, Colors.iceBlue, Colors.white]}
          />
          <Blur blur={VISUAL_CONFIG.blur} />
        </Rect>
      </Canvas>
    </View>
  );
});

Gradient.displayName = 'Gradient';

export default Gradient;
