import { StyleSheet, Text, View, Image } from 'react-native';
import { pixel } from '../../utils/index';

export default function UserServer(){
    return (
        <View style={styles.container}>
            <Image resizeMode="stretch" source={{uri:"https://img.spd9.com/admin/upload/lpb/zxkf_02.png"}} style={styles.img}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    },
    img:{
        height: "100%" ,
        width: 375 * pixel,
    }

});