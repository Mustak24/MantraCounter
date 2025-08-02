import { useEffect } from "react";
import { Animated, useAnimatedValue, View } from "react-native";

export default function ProgressBar({ progress }: { progress: number }): React.JSX.Element {

    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: progress, duration: 500, useNativeDriver: true
        }).start();
    }, [progress])

    return (
        <View style={{
            width: '100%',
            height: 5,
            backgroundColor: 'rgba(50,50,50,0.4)',
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative'
        }} >
            <Animated.View style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(50,200,150)',
                transform: [{ scaleX: animate0to1 }],
                transformOrigin: 'left',
                borderRadius: 6
            }} />
        </View>
    );
}