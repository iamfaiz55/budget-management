
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Alert, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useGoogleLoginMutation, useSignInMutation, useVerifyOTPMutation } from "@/redux/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleLoginButton from "../components/GoogleButton";
import { GoogleSignin, isSuccessResponse, statusCodes, User } from '@react-native-google-signin/google-signin';

const OTPLogin = () => {
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];
const [signInWithGoogle, {isSuccess, data:googleLoginData}]= useGoogleLoginMutation()
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);

  const [sendOTP, { isSuccess: otpSent, isLoading: otpLoading, isError: sendError, error }] = useSignInMutation();
  const [verifyOTP, { isSuccess: verified, data: verifyData, isLoading: verifying , data}] = useVerifyOTPMutation();

  const handleGoogleSignIn = async () => {
    try {
        await GoogleSignin.hasPlayServices()
        await GoogleSignin.signOut();

        const response = await GoogleSignin.signIn()
        if (isSuccessResponse(response)) {
            const { idToken } = response.data

            if (idToken) {
                await signInWithGoogle({ idToken })
                // if (data?.result) {
                //     dispatch(setUser(data.result))
                // }
            }
        }
    } catch (error) {
        console.log(error);

        }
    }
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

const handleSendOTP =  () => {
  if (!username) return Alert.alert("Please enter your email or mobile");

  // console.log("Sending OTP for username:", username);

  try {
     sendOTP({username });
    
    // if (response && response.data) {
    //   // console.log("OTP sent successfully:", response.data);
    //   setShowOTPField(true);
    // } else {
    //   Alert.alert("Error", "Failed to send OTP, please try again.");
    // }
  } catch (error) {
    console.error("Error sending OTP:", error);
    let errorMessage = "Failed to send OTP";

    // if (error && error.response && error.response.data && error.response.data.message) {
    //   errorMessage = error.response.data.message;
    // }

    Alert.alert("Error", errorMessage);
  }
};


  const handleVerifyOTP = async () => {
    if (!otp) return Alert.alert("Please enter OTP");
    await verifyOTP({ username, otp });
  };

  useEffect(() => {
    if (otpSent) setShowOTPField(true);
  
    if (sendError && error) {
      let errorMessage = "Failed to send OTP";
  
      if (typeof error === "object" && error !== null) {
        if ("status" in error) {
          const err = error as { data?: any };
          errorMessage = err.data?.message || errorMessage;
        } else if ("message" in error) {
          errorMessage = (error as { message: string }).message || errorMessage;
        }
      }
  
      Alert.alert("Error", errorMessage);
    }
  }, [otpSent, sendError]);
  



useEffect(() => {
    if (isSuccess && googleLoginData?.result?.token) {
      console.log("Login successful");
  
      const saveToken = async () => {
        await AsyncStorage.setItem("authToken", googleLoginData.result.token!); 
        await AsyncStorage.setItem("user", JSON.stringify(googleLoginData.result)); 
      };
  
      saveToken();
      router.replace("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (verified && data?.result?.token) {
      console.log("Login successful");
  
      const saveToken = async () => {
        await AsyncStorage.setItem("authToken", data.result.token!); 
        await AsyncStorage.setItem("user", JSON.stringify(data.result)); 
      };
  
      saveToken();
      router.replace("/");
    }
  }, [verified]);


  useEffect(() => {
    GoogleSignin.configure({
      // 482424704215-hsgq2olvh5pf12pdkvdu0p8n9n4k376s.apps.googleusercontent.com
      // iosClientId: "195321382919-59fvu1pkgvlr27mtdepi4adqu0n28coo.apps.googleusercontent.com",
      webClientId: "482424704215-55mudkvidkp7e60r3seuefi1uqkgeffp.apps.googleusercontent.com",
      profileImageSize: 150
    })
  }, [])


  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/2331/2331949.png" }}
          style={styles.logo}
        />

        <Text style={styles.title}>Login with OTP</Text>
        <Text style={styles.subtitle}>No password required ✨</Text>

        <TextInput
          label="Email or Mobile"
          value={username}
          onChangeText={setUsername}
          keyboardType="default"
          autoCapitalize="none"
          left={<TextInput.Icon icon="account" />}
          mode="outlined"
          style={styles.input}
        />

{!showOTPField && (
  <Button
    mode="contained"
    onPress={handleSendOTP}
    loading={otpLoading}
    disabled={otpLoading}
    style={styles.sendBtn}
  >
    {otpLoading ? "Sending OTP..." : "Send OTP"}
  </Button>
)}


        {showOTPField && (
          <>
            <TextInput
              label="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              left={<TextInput.Icon icon="key" />}
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleVerifyOTP}
              loading={verifying}
              disabled={verifying}
              style={styles.verifyBtn}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
        <GoogleLoginButton onPress={handleGoogleSignIn} />
{/* <GoogleLoginButton/> */}
<Button
  onPress={async () => {
    await AsyncStorage.removeItem("hasLaunched");
    Alert.alert("Reset", "'hasLaunched' flag has been cleared.");
  }}
  style={{ marginTop: 10 }}
  labelStyle={{ color: "red" }}
>
  Clear First-Time Flag
</Button>


        <Button
          onPress={() => router.push("/authentication/Register")}
          style={styles.link}
          labelStyle={{ color: "#42A5F5" }}
        >
          Don't have an account? Sign Up
        </Button>
      </Animated.View>
    </View>
  );
};
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

// const GoogleLoginButton = () => {
//   const router = useRouter();

//   const handleGoogleSignIn = async () => {
//     try {
//         await GoogleSignin.hasPlayServices()
//         await GoogleSignin.signOut();

//         const response = await GoogleSignin.signIn()
//         if (isSuccessResponse(response)) {
//             const { idToken } = response.data

//             if (idToken) {
//                 const { data } = await signInWithGoogle({ idToken })
//                 if (data?.result) {
//                     dispatch(setUser(data.result))
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);

//         }
//     }

//   return (
//     <GoogleLoginButton onPress={handleGoogleSignIn} />
//   );
// };

// export default GoogleLoginButton;

export default OTPLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    elevation: 6,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  sendBtn: {
    marginTop: 10,
    backgroundColor: "#1976D2",
  },
  verifyBtn: {
    marginTop: 10,
    backgroundColor: "#388E3C",
  },
  link: {
    marginTop: 20,
  },
});
