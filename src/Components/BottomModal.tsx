/* eslint-disable react-native/no-inline-styles */

import { Keyboard, Modal, ModalProps, PressableProps, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Dimensions } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimateButton from "./AnimateButton";


type BottomModalProps = ModalProps & {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    children: React.ReactNode,
    actionButtons?: ReactNode[],
    transparent?: boolean,
    style?: ViewStyle,
    bottomOpationStyle?: ViewStyle,
    backdropColor?: string,
    closeOnBack?: boolean,
    animationType?: "none" | "slide" | "fade",
    onClose?: () => void,
    alertId?: string,
    topMarginPrecentage?: number,
    topMargin?: number
}

export default function BottomModal({ visible, setVisible, children, style, backdropColor = 'rgba(0, 0, 0, 0.50)', actionButtons, closeOnBack = true, animationType = 'slide', bottomOpationStyle = {}, onClose = () => { }, alertId, topMarginPrecentage = 0.01, topMargin = 40, ...props }: BottomModalProps): React.JSX.Element {

    const { height } = Dimensions.get('window');
    const { top, bottom } = useSafeAreaInsets();

    const [maxHeight, setMaxHeight] = useState<number>(height - top - bottom - 32 - (height * topMarginPrecentage) - topMargin)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
            setMaxHeight((pre) => pre - endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ({ endCoordinates }) => {
            setMaxHeight(height - top - bottom - 32 - (height * topMarginPrecentage) - topMargin);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    return (
        <Modal {...props} backdropColor={backdropColor} animationType={animationType} visible={visible} onRequestClose={() => { setVisible(!closeOnBack); onClose(); }}>
            <View style={[styles.root]}>
                <AnimateButton onPress={() => { setVisible(false); onClose(); }} style={{ width: '100%', flex: 1 }} />

                <View style={[styles.modalContener, { backgroundColor: 'white', borderColor: 'black', maxHeight }, style]}>
                    {children}
                </View>


                <View style={[styles.bottomOpations, { backgroundColor: 'white', borderColor: 'black', borderWidth: 2, }, bottomOpationStyle]}>
                    <AnimateButton style={{ borderColor: 'black', backgroundColor: 'white', ...styles.closeBtn }} onPress={() => { setVisible(false); onClose(); }}>
                        <Text>X</Text>
                    </AnimateButton>

                    <View style={styles.actionsButtonsBox}>
                            {
                                actionButtons?.map((item, index) => (
                                    <View key={index} >
                                        {item}
                                    </View>
                                ))
                            }
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        flex: 1,
        paddingInline: 2,
    },

    modalContener: {
        width: '100%',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },

    bottomOpations: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderWidth: 1,
        borderBottomWidth: 0,
        height: 32,
        width: '100%',
        paddingInline: 20,
    },

    closeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 2,
        position: 'relative',
        top: -18,
    },

    actionsButtonsBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 14,
        transform: 'translateY(-25%)',
        position: 'relative',
    },
});