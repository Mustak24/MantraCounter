import { Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../Components/ProgressBar";
import AnimateButton from "../Components/AnimateButton";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import BottomModal from "../Components/BottomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CenterModal from "../Components/CenterModal";

export default function HomeScreen() {

    const [isBottomModalVisible, setBottomModalVisible] = useState<boolean>(false)
    const [isCenterModalVisible, setCenterModalVisible] = useState<boolean>(false)

    const [target, setTarget] = useState(1);
    const [count, setCount] = useState(0);
    
    const timeout = useRef<NodeJS.Timeout>(undefined)

    function hadnleCount(by: number) {
        const c = count + by;
        if(0 <= c && c <= target) {
            setCount(c)

            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                AsyncStorage.setItem('count', c.toString())
            }, 500)
        }
    }

    useEffect(() => {
        if(count === target) setCenterModalVisible(true);
    }, [count, target])

    useEffect(() => {
        if(target < count) setCount(target);
    }, [target])

    useEffect(() => {
        AsyncStorage.getItem('target-count').then(res => {setTarget(parseInt(res || '180'));});
        AsyncStorage.getItem('count').then(res => {setCount(parseInt(res || '0'))});
    }, [])


    return (
        <SafeAreaView style={{backgroundColor: 'white', flex: 1, width: '100%'}} >
            <View style={{width: "100%", height: '100%', paddingInline: 20, alignItems: 'center', paddingBlock: 20, justifyContent: 'space-between'}} >
                <View>
                    <Text style={{textAlign: 'center', fontSize: 28, fontWeight: 900}} >Mantra Counter</Text>
                    <Text style={{textAlign: 'center', fontSize: 16, opacity: 0.6}} >Track your meditation practice</Text>
                </View>

                <View style={{width: '100%', alignItems: 'center'}} >
                    <View style={{marginBlock: 30, width: '100%', gap: 4}} >
                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-between'}} >
                            <Text>Progress</Text>
                            <Text>{(100 * count / target).toFixed(2)}%</Text>
                        </View>
                        <ProgressBar progress={count / target} />
                    </View>

                    <View style={{alignItems: 'center'}} >
                        <Text style={{textAlign: 'center', fontSize: 80, fontWeight: 900, color: 'rgb(100, 50, 200)'}} >{count}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                            <Image source={require('../Assets/Icons/target-icon.png')} style={{aspectRatio: 1, width: 30}} />
                            <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 900}} >
                                Target: {target}
                            </Text>
                        </View>
                    </View>

                    <AnimateButton 
                        onPress={() => {hadnleCount(1)}}
                        style={{alignItems: 'center', justifyContent: 'center', aspectRatio: 1, width: 180, backgroundColor: 'rgb(100,50,200)', borderRadius: '50%', marginBlock: 20}} 
                        >
                        <Text style={{color: 'white', fontSize: 46, fontWeight: 900}}>+</Text>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 900}}>Count Mantra</Text>
                    </AnimateButton>

                </View>
                
                <View style={{gap: 20, width: '100%', marginTop: 40}} >
                    <AnimateButton 
                        onPress={() => {setBottomModalVisible(true)}}
                        style={{width: '100%', height: 44, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderRadius: 16, borderColor: "black", borderWidth: 2}} 
                    >
                        <Text style={{ fontSize: 16, fontWeight: 900}}>Set new target</Text>
                    </AnimateButton>

                    <View style={{gap: 12}} >
                        <AnimateButton 
                            onPress={() => hadnleCount(-count)}
                            style={{width: '100%', height: 44, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(50,50,50,0.5)', borderRadius: 16}} >
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 900}}>Reset Count</Text>
                        </AnimateButton>
                        
                        <AnimateButton
                            onPress={() => {hadnleCount(-1)}} 
                            style={{width: '100%', height: 44, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba(200,50,50,0.8)', borderRadius: 16}} >
                            <Text style={{color: 'white', fontSize: 16, fontWeight: 900}}>- Mantra Count</Text>
                        </AnimateButton>
                    </View>
                </View>

                <TargetModal visible={isBottomModalVisible} setVisible={setBottomModalVisible} target={target} setTarget={setTarget} />

                <CenterModal visible={isCenterModalVisible} >
                    <View style={{width: '100%', alignItems: 'center'}} >
                        <Text style={{fontSize: 40}} >🎉</Text>
                        <Text style={{fontSize: 16}} >Congratulations!</Text>
                        <Text style={{maxWidth: 300, marginTop: 10, textAlign: 'center'}} >You've completed {count} mantras. Your dedication to practice is inspiring!</Text>
                    </View>

                     <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20}} >
                        <AnimateButton 
                            onPress={() => {hadnleCount(-count); setCenterModalVisible(false)}}
                            style={{borderRadius: 12, backgroundColor: 'rgba(50,150,250,0.8)', height: 40, paddingInline: 20, alignItems: 'center', justifyContent: 'center'}} 
                        >
                            <Text style={{color: "white", fontSize: 14, fontWeight: 900}} >Reset Count</Text>
                        </AnimateButton>

                        <AnimateButton 
                            onPress={() => {setCenterModalVisible(false)}} 
                            style={{borderRadius: 12, backgroundColor: 'black', height: 40, paddingInline: 20, alignItems: 'center', justifyContent: 'center'}} >
                            <Text style={{color: "white", fontSize: 14, fontWeight: 900}} >Close</Text>
                        </AnimateButton>
                    </View>
                </CenterModal>  
            </View>
        </SafeAreaView>
    )
}


type TargetModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    target: number, 
    setTarget: Dispatch<SetStateAction<number>>
}

function TargetModal({visible, setVisible, target, setTarget}: TargetModalProps) {

    const input = useRef<TextInput>(null)
    const [val, setVal] = useState<string>('');

    function handleCount() {
        const num = parseInt(val || '0')
        if(!num) return;

        AsyncStorage.setItem('target-count', num.toString()).then(_ => {
            setTarget(num);
            setVisible(false);
        })
    }

    useEffect(() => {
        if(!visible) return;

        const timeout = setTimeout(() => {
            input.current?.focus();
        }, 250)

        return () => clearTimeout(timeout)
        
    }, [visible])

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{paddingInline: 20}}
            actionButtons={[
                <AnimateButton 
                    onPress={handleCount}
                    style={{backgroundColor: 'rgb(50,200,150)', paddingInline: 20, height: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} 
                >
                    <Text style={{color: 'white'}} >Set</Text>
                </AnimateButton>
            ]}
        >
            <Text style={{fontSize: 16, fontWeight: 900, color: 'black'}} >Set Target</Text>

            <View style={{marginBlock: 20, flexDirection: 'row', gap: 12, flexWrap: 'wrap', width: '100%'}} >
                {
                    [40, 60, 108, 120].map(count => (
                        <AnimateButton key={count} 
                            style={{borderRadius: 100, borderWidth: 2, borderColor: 'black', height: 36, alignItems: 'center', flexDirection: 'row', paddingInline: 20}}
                            
                            onPress={() => {AsyncStorage.setItem('target-count', count.toString()).then(_ => {
                                setTarget(count);
                                setVisible(false);
                            })}}
                        >
                            <Text>{count}</Text>
                        </AnimateButton>
                    ))
                }
            </View>

            <View style={{width: '100%', borderWidth: 0, borderColor: 'black', borderBottomWidth: 2}} >
                <TextInput
                    ref={input}
                    value={val}
                    style={{color: 'black'}}
                    placeholder="Enter Target"
                    placeholderTextColor={'gray'}
                    keyboardType="number-pad"
                    onChangeText={text => {
                        if('0123456789'.includes(text.at(-1) ?? '')) {
                            setVal(text);
                        }
                    }}
                />
            </View>

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
