import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { classicStrategyDetail } from '../../service/index'
import { pixel } from '../../utils/index';
import HTMLView from 'react-native-htmlview'

export default function DetailsScreen({ route }) {
    const [detail, setDetail] = useState({})
    const { content } = route.params;


    useEffect(() => {
        setDetail(content)
    }, [])

    const renderNode = (node) => {
       
        if (node.name === 'img') {
            return (
                <Image
                    source={{ uri: node.attribs.src }}
                    style={{width:350*pixel,height:300}}
                />
            )
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <HTMLView value={content} renderNode={renderNode} />
            </ScrollView>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
    // img: {
    //     width:300,
    //     height:150
    //     // height:150
    // }

});