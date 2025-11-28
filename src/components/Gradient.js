import React from 'react';
import { View } from 'react-native';

// Gradient Component - Currently a placeholder
// TODO: Uncomment and complete when @shopify/react-native-skia is properly set up
export default function Gradient() {
  return null; // Placeholder - can be customized later
}

// Commented out version with skia (uncomment when ready):
// import { Dimensions, StyleSheet } from "react-native";
// import { Blur, Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";

// const {width,height}=Dimensions.get("screen");

// export default function Gradient() {
//     return (
//         <View style={StyleSheet.absoluteFill}>
//             <Canvas style={{ flex: 1 }}>
//               <Rect x={0} y={0} width={width} height={height}>
//                 <RadialGradient
//                   c={vec(128, 128)}
//                   r={128}
//                   colors={[Colors.mediumBlue, Colors.lightBlue, Colors.teal, Colors.iceBlue, Colors.white]}
//                 />
//                 <Blur blur={10}/>
//               </Rect>
//             </Canvas>
//         </View>
//     );
// }

// const Colors = {
//   white: "#FFFFFF", 
//   teal: "#5AC8FA",
//   mediumBlue: "#007AFF",
//   lightBlue: "#4DA6FF",
//   iceBlue: "#E6F3FF",
// }
