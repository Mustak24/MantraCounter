import { ReactNode } from "react";
import { Modal, View } from "react-native";
import ScaleAnimationView from "./ScaleAnimation";

type Props = {
    visible: boolean,
    children: ReactNode
}

export default function CenterModal({visible, children}: Props) {


    return (
        <Modal
            visible={visible}
            backdropColor = 'rgba(0, 0, 0, 0.50)'
            animationType="fade"
        >
            <View style={{width: '100%', height: "100%", alignItems: 'center', justifyContent: 'center', paddingInline: 20}} >
                <ScaleAnimationView style={{backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', width: '100%', padding: 8}} >
                    {children}
                </ScaleAnimationView>
            </View>
        </Modal>
    )
}