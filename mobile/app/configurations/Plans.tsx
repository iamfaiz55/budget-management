import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useGetAllPlansQuery } from "@/redux/planApi";
import { useCreateSubscribeOrderMutation, useGetMyPlanQuery, useVerifyPaymentMutation } from "@/redux/subscriptionApi";
import Toast from "react-native-toast-message";


const Plans = () => {
  const router = useRouter();
  const { data: allPlans, isLoading, isError } = useGetAllPlansQuery();
  const { data: myPlan, isLoading: loadingPlan, refetch: refetchMyPlan } = useGetMyPlanQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [createPayment, { isLoading: creatingOrder , error:createError}] = useCreateSubscribeOrderMutation();
  const [verifyPayment, {isSuccess}] = useVerifyPaymentMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/authentication/Login");
      }
    };
    checkAuth();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (Platform.OS === "web") {
      Alert.alert("Not supported", "Payment is only supported on mobile devices.");
      return;
    }
  
    setSelectedPlanId(planId); // Set current loading plan
  
    try {
      const res = await createPayment({ planId }).unwrap();
      const order = res.result;
  
      if (!order?.orderId) {
        Alert.alert("Order Error", "Could not create order.");
        setSelectedPlanId(null);
        return;
      }
  
      const options = {
        description: "Expense App Subscription",
        image: "https://yourdomain.com/logo.png",
        currency: order.currency,
        key: order.key_id,
        amount: order.amount,
        name: "Expense App",
        order_id: order.orderId,
        prefill: {
          email: "johndoe@example.com",
          contact: "9876543210",
          name: "John Doe",
        },
        theme: { color: "#007AFF" },
      };
  
      RazorpayCheckout.open(options)
        .then((data: any) => {
          verifyPayment({
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
            planId: order.planId,
          });
          refetchMyPlan();
          setSelectedPlanId(null);
        })
        .catch((error: any) => {
          console.warn("Payment cancelled or failed:", error);
          setSelectedPlanId(null);
        });
    } catch (err) {
      console.error("Payment Error", err);
      Alert.alert("Error", "Something went wrong while processing payment.");
      setSelectedPlanId(null);
    }
  };
  

   useEffect(() => {
    //  if (isError && error) {
    //    Toast.show({
    //      type: 'error',
    //      text1: 'Transaction Failed',
    //      text2: error as string, 
    //      position: 'bottom',
    //    });
    //  }
     if(isSuccess){
       // console.log("transaction addded success");
       Toast.show({
         type: 'success',
         text1: 'Plan Purchase Success',
         // text2: , 
         position: 'bottom',
       });
       router.back()
     }
   }, [isError,isSuccess]);

  if (isLoading || loadingPlan) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
      </View>
  
      {/* Offer Banner */}
      <View style={styles.offerBanner}>
        <Text style={styles.offerText}>🎉 Limited Time Offer: Get 20% OFF on Annual Plans!</Text>
      </View>
  
      {/* Plans */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {allPlans?.result?.map((plan: any, index: number) => (
          <View
            key={plan._id}
            style={[
              styles.card,
              index === 1 && styles.featuredCard
            ]}
          >
            <View style={styles.titleRow}>
              <Text style={styles.planTitle}>{plan.name}</Text>
              {index === 1 && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Best Value</Text>
                </View>
              )}
              {plan.isPopular && (
                <View style={[styles.tag, { backgroundColor: "#007AFF" }]}>
                  <Text style={[styles.tagText, { color: "#fff" }]}>Recommended</Text>
                </View>
              )}
            </View>
  
            <View style={styles.divider} />
  
            <View style={styles.planDetailRow}>
              <Text style={styles.emoji}>💰</Text>
              <Text style={styles.planText}>₹{plan.price}</Text>
            </View>
            <View style={styles.planDetailRow}>
              <Text style={styles.emoji}>👥</Text>
              <Text style={styles.planText}>{plan.maxUsers} Users</Text>
            </View>
            <View style={styles.planDetailRow}>
              <Text style={styles.emoji}>📅</Text>
              <Text style={styles.planText}>{plan.duration} Days</Text>
            </View>
            {plan.trialDays && (
              <View style={styles.planDetailRow}>
                <Text style={styles.emoji}>🎁</Text>
                <Text style={styles.planText}>{plan.trialDays} Days Free Trial</Text>
              </View>
            )}
  
            <TouchableOpacity
              onPress={() => handleSubscribe(plan._id)}
              style={[
                styles.subscribeButton,
                selectedPlanId === plan._id && { opacity: 0.6 },
              ]}
              disabled={selectedPlanId === plan._id}
            >
              <Text style={styles.subscribeText}>
                {selectedPlanId === plan._id
                  ? "Processing..."
                  : `Subscribe for ₹${plan.price}`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
  
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help? <Text style={{ color: "#007AFF" }}>Contact Support</Text></Text>
        <Text style={styles.footerSubText}>By subscribing, you agree to our Terms & Privacy Policy.</Text>
      </View>
    </View>
  );
  
  
};

export default Plans;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },





  activeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    textAlign: "center",
  },
  subText: {
    marginTop: 10,
    color: "#555",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  

  scrollContent: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  
  card: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "90%",
    maxWidth: 340,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: "center",
  },
  
  planTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  
  planText: {
    fontSize: 16,
    color: "#444",
  },
  
  planDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  
  subscribeButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  
  subscribeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  badge: {
    backgroundColor: "#ff9500",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  featuredCard: {
    borderColor: "#007AFF",
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  offerBanner: {
    backgroundColor: "#fffae6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ffe58f",
  },
  offerText: {
    color: "#b26a00",
    fontWeight: "600",
  },
  
  tag: {
    backgroundColor: "#ffe58f",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  

});
