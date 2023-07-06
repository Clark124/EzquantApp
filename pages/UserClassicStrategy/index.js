import { StyleSheet, Text, View, Image } from 'react-native';
import { pixel } from '../../utils/index';
// import PDFView from 'react-native-pdf'

export default function UserServer(){
    return (
        <View style={styles.container}>
            <Text>111</Text>
            {/* <PDFView style={{flex:1}}
                source={{url:"https://img.spd9.com/admin/upload/jdzf/股市经典战法大全.pdf",cache:true}}
            /> */}
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