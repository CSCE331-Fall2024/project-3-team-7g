"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [weather, setWeather] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        
        //setText1()
        script.onload = () => {
            setIsScriptLoaded(true);
        };
    }, []);

    useEffect(() => {
        if (isScriptLoaded) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large" }
            );
        }
    }, [isScriptLoaded]);

    useEffect(() => {
        // Get user's geolocation and fetch weather data
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("User's location:", lat, lon); // For debugging

                fetchWeather(lat, lon);
            },
            (error) => {
                setLocationError(error.message);
                console.error("Error getting location:", error);
            }
        );
    }, []);

    const fetchWeather = async (lat, lon) => {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setWeather(data);
            } else {
                console.error("Failed to fetch weather data:", data.message);
                setLocationError(data.message);
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setLocationError("Unable to fetch weather data.");
        }
    };

    function handleCredentialResponse(response) {
        const userObject = parseJwt(response.credential);

        localStorage.setItem("userName", userObject.name);
        localStorage.setItem("userEmail", userObject.email);
        
        setIsLoading(true);
        handleLogin(userObject.email, userObject.name);
    }

    const handleLogin = async (userEmail, userName) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_PORT}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    userName
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const responseData = await response.json();
            
            if (responseData.classification === "Customer") {
                setTimeout(() => {
                    router.push("/customerOrder");
                }, 500);
            } else {
                localStorage.setItem("Classification", responseData.classification);
                setTimeout(() => {
                    router.push("/employeeHome");
                }, 500);
            }
            
        } catch (error) {
            console.log("Error logging in");
        }
    };

    function parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    }

    return (
        <div className="relative flex flex-col min-h-screen bg-[#ce123c]">
            {isLoading && (
                <div className="absolute inset-0 bg-black opacity-50 z-20 flex justify-center items-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            )}

            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute min-w-full min-h-full object-cover"
                >
                    <source src="/panda_cooking.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Welcome to Panda Express!
                </h1>
                <Image
                    src="/panda-express-logo.svg"
                    alt="Panda Express Food Items"
                    width={500}
                    height={500}
                    className="rounded-lg mb-10"
                />

                {/* Weather display */}
                {weather ? (
                    <div className="text-white text-lg mb-4">
                        <p>Current Temperature: {weather.main.temp}°F</p>
                        <p>Weather: {weather.weather[0].description}</p>
                    </div>
                ) : locationError ? (
                    <div className="text-white text-lg mb-4">
                        <p>Error fetching weather: {locationError}</p>
                    </div>
                ) : (
                    <div className="text-white text-lg mb-4">
                        <p>Loading weather...</p>
                    </div>
                )}

                <div className="flex space-evenly">
                    <Link href="menuBoard">
                        <button className="px-6 py-3 text-white font-semibold rounded-lg">
                            View Menu
                        </button>
                    </Link>
                    <h2 className="ml-2 mr-2 px-6 py-3 text-white font-bold bg-[#ce123c] rounded-lg">OR</h2>
                    <div id="google-signin-button"></div>
                </div>
            </main>
        </div>
    );
}