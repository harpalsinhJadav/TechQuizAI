import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserStore } from "../store";
import DrawerNavigator from "./DrawerNavigator";
import QuizScreen from "../screens/quiz/QuizScreen";
import ResultScreen from "../screens/result/ResultScreen";
import LoginScreen from "../screens/login/LoginScreen";
import SignupScreen from "../screens/signup/SignupScreen";
import ForgotPasswordScreen from "../screens/forgot-password/ForgotPasswordScreen";

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Main: undefined;
    Quiz: { categoryId?: string; quizId?: string };
    Result: { score: number, total: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="Main" component={DrawerNavigator} />
                    <Stack.Screen name="Quiz" component={QuizScreen} />
                    <Stack.Screen name="Result" component={ResultScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}