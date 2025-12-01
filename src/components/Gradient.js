import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';



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
  minScale: 0.6, maxScale: 1.4, speakingScale: 1.0, quietScale: 0.6,
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
    case "center": return VISUAL_CONFIG.center.y / 2;
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





export default function Gradient({ position, isSpeaking }) {
  const animatedY = useSharedValue(0);

  // gradient radio button ka size apan chnage karenge 

  const radiusScale = useSharedValue(1);
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





  useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);


  }, [position, animatedY])




  useEffect(() => {

    animatedY.value = getTargetY(position)

  }, [])



  useEffect(() => {

    const targetRadius = calculateTargetRadius(RADIUS_CONFIG.baseRadius.default, isSpeaking);
    mountRadius.value = withTiming(targetRadius, { duration: ANIMATION_CONFIG.durations.MOUNT })

  }, [])





  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION


    if (isSpeaking) {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking, { duration });
      animatedY.value = withTiming(getTargetY("center"), { duration });

    } else {
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default, { duration });

      animatedY.value = withTiming(getTargetY(position), { duration });
    }
  }, [
    isSpeaking,
    baseRadiusValue,
    animatedY,
    position
  ]);

  return (
    <View style={StyleSheet.absoluteFill}>
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
}

const Colors = {
  white: "#FFFFFF",
  teal: "#5AC8FA",
  mediumBlue: "#007AFF",
  lightBlue: "#4DA6FF",
  iceBlue: "#E6F3FF",
}
