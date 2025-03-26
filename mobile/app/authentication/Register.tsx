// import { useEffect, useState } from "react";
// import { Image, StyleSheet, View, Animated } from "react-native";
// import { TextInput, Text, Button } from "react-native-paper";
// import { useRouter } from "expo-router";
// import { useForm, Controller } from "react-hook-form";

// const Register = () => {
//     const router = useRouter();
//     const { control, handleSubmit, watch } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             role: "",
//             image: "",
//             phone: ""
//         }
//     });
//     const password = watch("password");
//     const fadeAnim = useState(new Animated.Value(0))[0];

//     useEffect(() => {
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const handleRegister = async (data:any) => {
//         if (data.password !== data.confirmPassword) {
//             alert("Passwords do not match");
//             return;
//         }
//         try {
//             console.log("user data", data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Animated.View style={[styles.header, { opacity: fadeAnim }]}>  
//                 <Image
//                     style={styles.logo}
//                     source={{ uri: "https://img.icons8.com/?size=100&id=lQ4UQO3LMB5D&format=png&color=FF7043" }}
//                 />
//             </Animated.View>

//             <Text style={styles.title}>Create an Account</Text>

//             <Animated.View style={[styles.form, { opacity: fadeAnim }]}>  
//                 <Controller
//                     control={control}
//                     name="name"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Full Name"
//                             value={value}
//                             onChangeText={onChange}
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="email"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Email Address"
//                             value={value}
//                             onChangeText={onChange}
//                             keyboardType="email-address"
//                             autoCapitalize="none"
//                             left={<TextInput.Icon icon="email" />}
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="password"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Password"
//                             value={value}
//                             onChangeText={onChange}
//                             secureTextEntry
//                             left={<TextInput.Icon icon="lock" />}
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="confirmPassword"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Confirm Password"
//                             value={value}
//                             onChangeText={onChange}
//                             secureTextEntry
//                             left={<TextInput.Icon icon="lock-check" />}
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="role"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Role"
//                             value={value}
//                             onChangeText={onChange}
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="phone"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Phone Number"
//                             value={value}
//                             onChangeText={onChange}
//                             keyboardType="phone-pad"
//                             style={styles.input}
//                         />
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="image"
//                     render={({ field: { onChange, value } }) => (
//                         <TextInput
//                             mode="outlined"
//                             label="Profile Image URL"
//                             value={value}
//                             onChangeText={onChange}
//                             style={styles.input}
//                         />
//                     )}
//                 />

//                 <Button
//                     mode="contained"
//                     onPress={handleSubmit(handleRegister)}
//                     style={styles.button}
//                 >
//                     Sign Up
//                 </Button>
//             </Animated.View>
//         </View>
//     );
// };

// export default Register;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         justifyContent: "center",
//         backgroundColor: "#FFE0B2",
//     },
//     header: {
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     logo: {
//         width: 100,
//         height: 100,
//     },
//     title: {
//         textAlign: "center",
//         fontSize: 22,
//         fontWeight: "bold",
//         marginBottom: 20,
//         color: "#D84315",
//     },
//     form: {
//         backgroundColor: "#FFFFFF",
//         padding: 25,
//         borderRadius: 15,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     input: {
//         backgroundColor: "#FFFFFF",
//         marginBottom: 10,
//         borderRadius: 10,
//     },
//     button: {
//         marginTop: 10,
//         backgroundColor: "#FF7043",
//         borderRadius: 10,
//         paddingVertical: 8,
//     },
// });
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View, Animated } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useRegisterMutation } from "@/redux/authApi";

const Register = () => {
    const router = useRouter();
    const [register, {isSuccess, isError , error}]= useRegisterMutation()
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
            phone: ""
        }
    });
    const password = watch("password");
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleRegister = async (data:any) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            console.log("User registered:", data);
            register(data)
        } catch (err) {
            console.error("Registration error:", err);
        }
    };

  useEffect(() => {
    
    if(isSuccess){
console.log("regitered successfully");

    };
    if(isError){
console.log("regitered successfully");

    };
  }, [isSuccess, isError]);


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>  
                <Image
                    style={styles.logo}
                    source={{ uri: "https://cdn-icons-png.flaticon.com/128/1077/1077063.png" }}
                />
            </Animated.View>

            <Text style={styles.title}>Create Your Account</Text>

            <Animated.View style={[styles.form, { opacity: fadeAnim }]}>  
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Full Name"
                            value={value}
                            onChangeText={onChange}
                            style={styles.input}
                            left={<TextInput.Icon icon="account" />}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Email Address"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email" />}
                            style={styles.input}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Password"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            left={<TextInput.Icon icon="lock" />}
                            style={styles.input}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Confirm Password"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            left={<TextInput.Icon icon="lock-check" />}
                            style={styles.input}
                        />
                    )}
                />
       
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            mode="outlined"
                            label="Phone Number"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="phone-pad"
                            style={styles.input}
                            left={<TextInput.Icon icon="phone" />}

                        />
                    )}
                />
              
                <Button
                    mode="contained"
                    onPress={handleSubmit(handleRegister)}
                    style={styles.button}
                >
                    Register Now
                </Button>
               <Link href={"/authentication/Login"} style={styles.forgotPassword}>Already Have Account</Link>
                
            </Animated.View>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#E3F2FD",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1976D2",
    },
    form: {
        backgroundColor: "#FFFFFF",
        padding: 25,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        backgroundColor: "#FFFFFF",
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: "#42A5F5",
        borderRadius: 10,
        paddingVertical: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: "center",
        marginVertical: 10,
    },
    imagePickerContainer: {
      alignItems: "center",
      marginBottom: 15,
      backgroundColor: "#F5F5F5",
      padding: 15,
      borderRadius: 10,
  },
  imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: "#42A5F5",
  },
  forgotPassword: {
    textAlign: "center",
    color: "#007BFF",
    marginVertical: 5,
},
  // button: {
  //     marginTop: 10,
  //     backgroundColor: "#42A5F5",
  //     borderRadius: 10,
  //     paddingVertical: 8,
  // },
});


