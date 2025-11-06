import { Dimensions, StyleSheet, View } from "react-native";

import { Blur, Canvas, RadialGradient, Rect, vec } from "@shopify/react-native-skia";

const {width,height}=Dimensions.get("screen");

export function Gradient() {
    return (
        <View style={StyleSheet.absoluteFill}>
            
            <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
         
          <RadialGradient
            c={vec(128, 128)} // 3. 'vec' needs to be imported from skia
            r={128}
            colors={[Colors.mediumBlue,Colors.lightBlue,Colors.teal ,Colors.iceBlue, Colors.white]}
          />

          <Blur blur={10}/>
        </Rect>
      </Canvas>

        </View>
    );

} 
const Colors={
white: "#FFFFFF", 
teal: "#5AC8FA",
mediumBlue:"#007AFF",
lightBlue:"#4DA6FF" ,
iceBlue:"#E6F3FF",
}
    
