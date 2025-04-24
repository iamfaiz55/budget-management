import { useEffect, useState } from "react";
import { StyleSheet, View, Animated, Image } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useRegisterMutation, useSendOtpRegisterMutation, useVerifyRegisterMutation } from "@/redux/authApi";

const Register = () => {
  const router = useRouter();

  const fadeAnim = useState(new Animated.Value(0))[0];
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      otp: "",
    },
  });

  const name = watch("name");
  const email = watch("email");
  const mobile = watch("mobile");
  const otp = watch("otp");

  const [sendOTP, { isSuccess: otpSent, error: otpError }] = useSendOtpRegisterMutation();
  const [verifyOTP, { isSuccess: otpVerified, error: verifyError }] = useVerifyRegisterMutation();
  const [registerUser] = useRegisterMutation();

  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (otpSent) setShowOTP(true);
    if (otpVerified) setIsVerified(true);
  }, [otpSent, otpVerified]);

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      alert("Enter a valid 10-digit number");
      return;
    }
    await sendOTP({ mobile });
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      alert("Enter a valid OTP");
      return;
    }
    try {
      await verifyOTP({ mobile, otp }).unwrap();
      setIsVerified(true);
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  const handleRegister = async (data: any) => {
    if (!isVerified) {
      alert("Please verify OTP first");
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
    };

    try {
      await registerUser(payload).unwrap();
      router.push("/authentication/Login");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Image
          style={styles.logo}
          source={{ uri: "https://cdn-icons-png.flaticon.com/128/1077/1077063.png" }}
        />
      </Animated.View>

      <Text style={styles.title}>Register</Text>

      <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
        {/* Name */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              error={!!errors.name}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        {/* Mobile */}
        <Controller
          control={control}
          name="mobile"
          rules={{
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Mobile Number"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              keyboardType="number-pad"
              disabled={showOTP}
              error={!!errors.mobile}
            />
          )}
        />
        {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}

        {!showOTP && (
          <Button mode="contained" onPress={handleSendOTP} style={styles.button}>
            Get OTP
          </Button>
        )}

        {/* OTP */}
        {showOTP && (
          <>
            <Controller
              control={control}
              name="otp"
              rules={{ required: "OTP is required", minLength: { value: 4, message: "Enter valid OTP" } }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Enter OTP"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="key" />}
                  keyboardType="number-pad"
                  error={!!errors.otp}
                />
              )}
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

            <Button mode="contained" onPress={handleVerifyOTP} style={[styles.button, { backgroundColor: "#43A047" }]}>
              Verify OTP
            </Button>

            {verifyError && <Text style={styles.errorText}>Invalid OTP</Text>}
          </>
        )}

        {/* Final Submit */}
        <Button
          mode="contained"
          onPress={handleSubmit(handleRegister)}
          disabled={!isVerified}
          style={[styles.button, !isVerified && styles.disabledButton]}
        >
          Register
        </Button>

        {otpError && <Text style={styles.errorText}>Failed to send OTP</Text>}

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={() => router.push("/authentication/Login")}>
            Login
          </Text>
        </Text>
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
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginBottom: 5,
  },
  loginText: {
    textAlign: "center",
    marginTop: 15,
    color: "#455A64",
  },
  loginLink: {
    color: "#1976D2",
    fontWeight: "bold",
  },
});
