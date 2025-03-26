import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-paper'
import { Link } from 'expo-router'

const Splash = () => {
    return (
        <View style={styles.main}>
            <View>
                <Image style={styles.image} width={100} height={100} source={{ uri: "https://i.pinimg.com/736x/47/88/bd/4788bd2081bf7eb2697e1d324dd86ec6.jpg" }} />
            </View>
            <View>
                <Text style={styles.text}>You Are Ready To Go!</Text>
                <Text style={styles.description}>Thanks for taking your time to create account with us.Now this is the fun part, let's explore the app.</Text>
            </View>
            <Link href="/screens/Home"><Icon source={"chevron-double-right"} size={50} color='white' /></Link>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    main: {
        alignItems: "center",
        height: Dimensions.get("screen").height,
        gap: 40,
        backgroundColor: "indigo",
        paddingTop: 120
    },
    text: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        color: "white"
    },
    image: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "red"
    },
    description: {
        color: "grey",
        padding: 10,
        textAlign: "center",
        paddingHorizontal: 50,

    }
})
// import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { Icon } from 'react-native-paper';
// import { Link } from 'expo-router';

// const Splash = () => {
//     return (
//         <View style={styles.main}>
//             <View>
//                 <Image 
//                     style={styles.image} 
//                     width={120} 
//                     height={120} 
//                     source={{ uri: "https://cdn-icons-png.flaticon.com/512/3209/3209265.png" }} 
//                 />
//             </View>
//             <View>
//                 <Text style={styles.text}>Welcome to Clinic Management</Text>
//                 <Text style={styles.description}>
//                     Your health, our priority. Manage appointments, medical records, and more with ease. Let's get started!
//                 </Text>
//             </View>
//             <Link href="/screens/Home">
//                 <Icon source="chevron-double-right" size={50} color='white' />
//             </Link>
//         </View>
//     );
// }

// export default Splash;

// const styles = StyleSheet.create({
//     main: {
//         alignItems: "center",
//         height: Dimensions.get("screen").height,
//         gap: 40,
//         backgroundColor: "#007BFF",
//         paddingTop: 120,
//     },
//     text: {
//         fontWeight: "bold",
//         fontSize: 22,
//         textAlign: "center",
//         color: "white",
//     },
//     image: {
//         borderRadius: 20,
//         borderWidth: 2,
//         borderColor: "white",
//     },
//     description: {
//         color: "white",
//         padding: 15,
//         textAlign: "center",
//         paddingHorizontal: 50,
//         fontSize: 16,
//     }
// });
