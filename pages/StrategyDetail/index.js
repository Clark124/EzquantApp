import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { classicStrategyDetail } from '../../service/index'
import { pixel } from '../../utils/index';

export default function DetailsScreen({ route }) {
    const [detail, setDetail] = useState({})
    const { id } = route.params;


    useEffect(() => {
        classicStrategyDetail({ id }).then(res => {
            setDetail(res.data)
        })
    }, [])


    return (

        <View style={styles.container}>
            <Image
                resizeMode="stretch"
                style={styles.banner}
                source={{ uri: detail.imgUrl }}
            />
            <ScrollView style={styles.descriptionWrap}
                keyboardDismissMode='on-drag'
            >
                <Text style={styles.description}>{detail.description}</Text>
            </ScrollView>
            <StatusBar style="auto" />
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        height: 250 * pixel,
        width: 375 * pixel
    },
    description: {
        padding: 15,
        fontSize: 18,
        lineHeight: 22
    },
    descriptionWrap:{
        flex: 1,
    }
});