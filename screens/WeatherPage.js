// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, Alert } from 'react-native';
// import * as Location from 'expo-location';

// export default function WeatherPage() {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchWeather = async (lat, lon) => {
//     try {
//       const API_KEY = '201a7bbca3a04393fe93f5cbe1ba4055'; // Replace with your API key
//       const res = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
//       );
//       const json = await res.json();
//       setWeather(json);
//     } catch (err) {
//       Alert.alert('Error', 'Could not fetch weather');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location is needed to fetch weather');
//         setLoading(false);
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       fetchWeather(location.coords.latitude, location.coords.longitude);
//     })();
//   }, []);

//   if (loading) return <ActivityIndicator className="flex-1" size="large" color="green" />;

//   return (
//     <View className="flex-1 bg-white p-5">
//       <Text className="text-2xl font-bold text-green-700 mb-4">Current Weather</Text>
//       {weather ? (
//         <View className="bg-blue-100 p-4 rounded-2xl shadow-md">
//           <Text className="text-lg text-blue-800">📍 {weather.name}</Text>
//           <Text className="text-lg text-blue-800">🌡️ Temp: {weather.main.temp} °C</Text>
//           <Text className="text-lg text-blue-800">🌤️ Condition: {weather.weather[0].description}</Text>
//         </View>
//       ) : (
//         <Text>No weather data available.</Text>
//       )}
//     </View>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   ToastAndroid,
// } from 'react-native';
// import * as Location from 'expo-location';
// import Wind from 'lucide-react-native/dist/esm/icons/wind';
// import Droplets from 'lucide-react-native/dist/esm/icons/droplets';
// import Sunrise from 'lucide-react-native/dist/esm/icons/sunrise';
// import CloudRain from 'lucide-react-native/dist/esm/icons/cloud-rain';
// import Sun from 'lucide-react-native/dist/esm/icons/sun';
// import Moon from 'lucide-react-native/dist/esm/icons/moon';
// import Thermometer from 'lucide-react-native/dist/esm/icons/thermometer';
// import Eye from 'lucide-react-native/dist/esm/icons/eye';
// import Gauge from 'lucide-react-native/dist/esm/icons/gauge';
// import Cloud from 'lucide-react-native/dist/esm/icons/cloud';

// export default function WeatherPage() {
//   const [weather, setWeather] = useState(null);
//   const [forecast, setForecast] = useState(null);
//   const [aqi, setAqi] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('Today');
//   const [refreshing, setRefreshing] = useState(false);

//   const API_KEY = '201a7bbca3a04393fe93f5cbe1ba4055';

//   const fetchWeather = async (lat, lon) => {
//     try {
//       setLoading(true);

//       const [currentRes, forecastRes, aqiRes] = await Promise.all([
//         fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
//         fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
//         fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
//       ]);

//       if (!currentRes.ok || !forecastRes.ok || !aqiRes.ok) {
//         throw new Error('One or more responses failed');
//       }

//       const currentData = await currentRes.json();
//       const forecastData = await forecastRes.json();
//       const aqiData = await aqiRes.json();

//       if (!currentData || !forecastData || !aqiData?.list?.length) {
//         throw new Error('Incomplete data received from API');
//       }

//       setWeather(currentData);
//       setForecast(forecastData);
//       setAqi(aqiData.list[0]);

//       ToastAndroid.show("Data refreshed!", ToastAndroid.SHORT);
//     } catch (err) {
//       console.error('Fetch Weather Error:', err);
//       Alert.alert('Error', 'Could not fetch weather data. Please check your internet or try again later.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location is required to fetch weather data.');
//         setRefreshing(false);
//         return;
//       }
//       let loc = await Location.getCurrentPositionAsync({});
//       fetchWeather(loc.coords.latitude, loc.coords.longitude);
//     } catch (err) {
//       console.error('Location Error (Refresh):', err);
//       Alert.alert('Error', 'Failed to get location. Please enable GPS.');
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Permission Denied', 'Location permission is required to fetch weather.');
//           setLoading(false);
//           return;
//         }
//         let loc = await Location.getCurrentPositionAsync({});
//         fetchWeather(loc.coords.latitude, loc.coords.longitude);
//       } catch (err) {
//         console.error('Location Error (Initial):', err);
//         Alert.alert('Error', 'Failed to fetch location. Make sure GPS is enabled.');
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // if(loading || !weather) {
//   if (!weather) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32' }}>
//         <ActivityIndicator size="large" color="#fff" />
//         <Text className="text-white text-lg">Fetching Weather...</Text>
//       </View>
//     );
//   }

//   // --- Utility Functions ---
//   const calculateDewPoint = (temp, humidity) => {
//     const a = 17.27, b = 237.7;
//     const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
//     return Math.round((b * alpha) / (a - alpha));
//   };

//   const getMoonPhase = () => {
//     const today = new Date();
//     const day = today.getUTCDate();
//     const month = today.getUTCMonth() + 1;
//     const year = today.getUTCFullYear();
//     const c = Math.floor((14 - month) / 12);
//     const y = year + 4800 - c;
//     const m = month + 12 * c - 3;
//     const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
//     const phase = (jd + 4.867) % 29.53;
//     if (phase < 1 || phase > 28.53) return "New";
//     if (phase < 7.38) return "Waxing Crescent";
//     if (phase < 8.38) return "First Quarter";
//     if (phase < 14.76) return "Waxing Gibbous";
//     if (phase < 15.76) return "Full";
//     if (phase < 22.14) return "Waning Gibbous";
//     if (phase < 23.14) return "Last Quarter";
//     return "Waning Crescent";
//   };

//   const getVisibility = (meters) => (meters / 1000).toFixed(1);

//   const getUVIndex = () => {
//     const hour = new Date().getHours();
//     if (hour >= 10 && hour <= 15) return 6;
//     if (hour >= 7 && hour <= 17) return 4;
//     return 1;
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
//   };

//   const dewPoint = calculateDewPoint(weather.main?.temp || 0, weather.main?.humidity || 0);
//   const sunrise = formatTime(weather.sys?.sunrise || 0);
//   const sunset = formatTime(weather.sys?.sunset || 0);
//   const uvIndex = getUVIndex();
//   const visibility = getVisibility(weather.visibility || 0);
//   const pressure = weather.main?.pressure || 'N/A';
//   const aqiIndex = aqi?.main?.aqi;
//   const aqiLevel = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqiIndex - 1] || 'N/A';

//   // --- Main Return UI ---
//   return (
//     <View style={{ flex: 1, backgroundColor: '#2e7d32' }}>
//       <ScrollView
//         style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             progressViewOffset={100}
//             colors={['#2e7d32']}
//           />
//         }
//       >
//         {/* Current Weather Block */}
//         <View style={{ margin: 16, backgroundColor: '#e8f5e9', borderRadius: 12, padding: 16 }}>
//           <Text style={{ fontSize: 14, color: '#2e7d32' }}>Now</Text>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
//             <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#1b5e20' }}>{Math.round(weather.main.temp)}°</Text>
//             <View>
//               <Text style={{ fontSize: 20, fontWeight: '500', color: '#2e7d32' }}>{weather.weather[0].main}</Text>
//               <Text style={{ fontSize: 14, color: '#388e3c' }}>Feels like {Math.round(weather.main.feels_like)}°</Text>
//             </View>
//           </View>
//           <Text style={{ color: '#2e7d32', marginTop: 4 }}>High: {Math.round(weather.main.temp_max)}° Low: {Math.round(weather.main.temp_min)}°</Text>
//         </View>

//         {/* Tab Buttons */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 8 }}>
//           {['Today', 'Tomorrow', '10 Days'].map(tab => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab)}
//               style={{
//                 paddingHorizontal: 14,
//                 paddingVertical: 8,
//                 borderRadius: 20,
//                 backgroundColor: activeTab === tab ? '#c8e6c9' : '#f0f0f0'
//               }}
//             >
//               <Text style={{ fontWeight: '500', color: activeTab === tab ? '#2e7d32' : '#757575' }}>{tab}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Weather Info Cards */}
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
//           {[{
//             icon: <Wind size={24} color="#1b5e20" />, label: 'Wind Speed', value: `${Math.round(weather.wind.speed)} km/h`
//           }, {
//             icon: <Droplets size={24} color="#1b5e20" />, label: 'Humidity', value: `${weather.main.humidity}%`
//           }, {
//             icon: <Thermometer size={24} color="#1b5e20" />, label: 'Dew Point', value: `${dewPoint}°`
//           }, {
//             icon: <Gauge size={24} color="#1b5e20" />, label: 'Pressure', value: `${pressure} hPa`
//           }, {
//             icon: <Eye size={24} color="#1b5e20" />, label: 'Visibility', value: `${visibility} km`
//           }, {
//             icon: <Sunrise size={24} color="#1b5e20" />, label: 'Sunrise', value: sunrise
//           }, {
//             icon: <Sun size={24} color="#1b5e20" />, label: 'UV Index', value: uvIndex
//           }, {
//             icon: <Moon size={24} color="#1b5e20" />, label: 'Moon Phase', value: getMoonPhase()
//           }, {
//             icon: <CloudRain size={24} color="#1b5e20" />, label: 'Condition', value: weather.weather[0].description
//           }, {
//             icon: <Cloud size={24} color="#1b5e20" />, label: 'Air Quality', value: aqiLevel
//           }].map((item, i) => (
//             <View key={i} style={{ width: '50%', padding: 8 }}>
//               <View style={{ backgroundColor: '#f1f8e9', padding: 12, borderRadius: 12 }}>
//                 {item.icon}
//                 <Text style={{ color: '#2e7d32', marginTop: 4, fontWeight: 'bold' }}>{item.label}</Text>
//                 <Text style={{ color: '#388e3c' }}>{item.value}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, ScrollView, ActivityIndicator,
//   RefreshControl, TouchableOpacity, ToastAndroid, Alert
// } from 'react-native';
// import * as Location from 'expo-location';
// import { Entypo } from '@expo/vector-icons';

// const API_KEY = '201a7bbca3a04393fe93f5cbe1ba4055'; // Replace with your actual key

// export default function WeatherPage() {
//   const [location, setLocation] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [forecast, setForecast] = useState([]);
//   const [tomorrowWeather, setTomorrowWeather] = useState({});
//   const [aqi, setAqi] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState('Today');

//   useEffect(() => {
//     requestLocation();
//   }, []);

//   const requestLocation = async () => {
//     setLoading(true);
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Allow location access to get weather updates');
//       setLoading(false);
//       return;
//     }

//     let loc = await Location.getCurrentPositionAsync({});
//     setLocation(loc.coords);
//     fetchWeather(loc.coords.latitude, loc.coords.longitude);
//   };

//   const fetchWeather = async (lat, lon) => {
//     try {
//       setLoading(true);

//       const [currentRes, forecastRes, aqiRes] = await Promise.all([
//         fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
//         fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
//         fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
//       ]);

//       const currentData = await currentRes.json();
//       const forecastData = await forecastRes.json();
//       const aqiData = await aqiRes.json();

//       setWeather(currentData);
//       setForecast(forecastData);
//       setAqi(aqiData?.list?.[0] || {});

//       // Get tomorrow's weather (first forecast item for tomorrow)
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       const tomorrowDate = tomorrow.toISOString().split('T')[0];

//       const tomorrowData = forecastData.list.find(item => {
//         const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
//         return itemDate === tomorrowDate;
//       });

//       setTomorrowWeather(tomorrowData);

//       ToastAndroid.show("Data refreshed!", ToastAndroid.SHORT);
//     } catch (err) {
//       console.error('Fetch Error:', err);
//       Alert.alert('Error', 'Failed to fetch weather data.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     if (location) {
//       fetchWeather(location.latitude, location.longitude);
//     }
//   };

//   const renderTabs = () => (
//     <View className="flex-row justify-around mt-4">
//       {['Today', 'Tomorrow'].map(tab => (
//         <TouchableOpacity
//           key={tab}
//           className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-300'}`}
//           onPress={() => setActiveTab(tab)}
//         >
//           <Text className={`text-white font-bold`}>{tab}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-white">
//         <ActivityIndicator size="large" color="#1D4ED8" />
//         <Text className="mt-2 text-blue-800">Loading weather data...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       className="flex-1 bg-white"
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       <View className="p-4">
//         <Text className="text-2xl font-bold text-blue-800">Weather Dashboard</Text>
//         <Text className="text-gray-500">Location: {weather?.name}</Text>
//         <Text className="text-3xl font-bold mt-2 text-black">
//           {Math.round(weather?.main?.temp)}°C
//         </Text>
//         <Text className="text-lg capitalize text-gray-700">{weather?.weather?.[0]?.description}</Text>
//         <Text className="mt-2 text-sm text-gray-500">Humidity: {weather?.main?.humidity}%</Text>
//         <Text className="text-sm text-gray-500">Wind: {weather?.wind?.speed} m/s</Text>

//         {aqi && (
//           <Text className="mt-2 text-sm text-green-700">
//             Air Quality Index: {aqi.main?.aqi} (1=Good, 5=Very Poor)
//           </Text>
//         )}
//       </View>

//       {renderTabs()}

//       {/* Today Tab */}
//       {activeTab === 'Today' && (
//         <View className="p-4">
//           <Text className="text-lg font-bold text-blue-700 mb-2">Today</Text>
//           <Text className="text-sm text-gray-500">Temperature: {Math.round(weather?.main?.temp)}°C</Text>
//           <Text className="text-sm text-gray-500">Humidity: {weather?.main?.humidity}%</Text>
//           <Text className="text-sm text-gray-500">Wind: {weather?.wind?.speed} m/s</Text>
//           <Text className="text-sm text-gray-500">Condition: {weather?.weather?.[0]?.description}</Text>
//         </View>
//       )}

//       {/* Tomorrow Tab */}
//       {activeTab === 'Tomorrow' && (
//         <View className="p-4">
//           <Text className="text-lg font-bold text-green-700 mb-2">Tomorrow</Text>
//           {tomorrowWeather ? (
//             <>
//               <Text className="text-sm text-gray-500">Temperature: {Math.round(tomorrowWeather.main?.temp)}°C</Text>
//               <Text className="text-sm text-gray-500">Humidity: {tomorrowWeather.main?.humidity}%</Text>
//               <Text className="text-sm text-gray-500">Wind: {tomorrowWeather.wind?.speed} m/s</Text>
//               <Text className="text-sm text-gray-500">Condition: {tomorrowWeather.weather?.[0]?.description}</Text>
//             </>
//           ) : (
//             <Text className="text-gray-500 text-center">No forecast available for tomorrow.</Text>
//           )}
//         </View>
//       )}
//     </ScrollView>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import * as Location from 'expo-location';
import Wind from 'lucide-react-native/dist/esm/icons/wind';
import Droplets from 'lucide-react-native/dist/esm/icons/droplets';
import Sunrise from 'lucide-react-native/dist/esm/icons/sunrise';
import CloudRain from 'lucide-react-native/dist/esm/icons/cloud-rain';
import Sun from 'lucide-react-native/dist/esm/icons/sun';
import Moon from 'lucide-react-native/dist/esm/icons/moon';
import Thermometer from 'lucide-react-native/dist/esm/icons/thermometer';
import Eye from 'lucide-react-native/dist/esm/icons/eye';
import Gauge from 'lucide-react-native/dist/esm/icons/gauge';
import Cloud from 'lucide-react-native/dist/esm/icons/cloud';

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [tomorrowWeather, setTomorrowWeather] = useState({});
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const [refreshing, setRefreshing] = useState(false);

  const API_KEY = '201a7bbca3a04393fe93f5cbe1ba4055';

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);

      const [currentRes, forecastRes, aqiRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      ]);

      if (!currentRes.ok || !forecastRes.ok || !aqiRes.ok) {
        throw new Error('One or more responses failed');
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      const aqiData = await aqiRes.json();

      if (!currentData || !forecastData || !aqiData?.list?.length) {
        throw new Error('Incomplete data received from API');
      }

      setWeather(currentData);
      setForecast(forecastData);
      setAqi(aqiData.list[0]);

      // Get tomorrow's weather (first forecast item for tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      const tomorrowData = forecastData.list.find(item => {
        const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
        return itemDate === tomorrowDate;
      });

      setTomorrowWeather(tomorrowData);

      ToastAndroid.show("Data refreshed!", ToastAndroid.SHORT);
    } catch (err) {
      console.error('Fetch Weather Error:', err);
      Alert.alert('Error', 'Could not fetch weather data. Please check your internet or try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required to fetch weather data.');
        setRefreshing(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      fetchWeather(loc.coords.latitude, loc.coords.longitude);
    } catch (err) {
      console.error('Location Error (Refresh):', err);
      Alert.alert('Error', 'Failed to get location. Please enable GPS.');
      setRefreshing(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to fetch weather.');
          setLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        fetchWeather(loc.coords.latitude, loc.coords.longitude);
      } catch (err) {
        console.error('Location Error (Initial):', err);
        Alert.alert('Error', 'Failed to fetch location. Make sure GPS is enabled.');
        setLoading(false);
      }
    })();
  }, []);

  // if(loading || !weather) {
  if (!weather) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32' }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white text-lg">Fetching Weather...</Text>
      </View>
    );
  }

  // --- Utility Functions ---
  const calculateDewPoint = (temp, humidity) => {
    const a = 17.27, b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return Math.round((b * alpha) / (a - alpha));
  };

  const getMoonPhase = () => {
    const today = new Date();
    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    const c = Math.floor((14 - month) / 12);
    const y = year + 4800 - c;
    const m = month + 12 * c - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const phase = (jd + 4.867) % 29.53;
    if (phase < 1 || phase > 28.53) return "New";
    if (phase < 7.38) return "Waxing Crescent";
    if (phase < 8.38) return "First Quarter";
    if (phase < 14.76) return "Waxing Gibbous";
    if (phase < 15.76) return "Full";
    if (phase < 22.14) return "Waning Gibbous";
    if (phase < 23.14) return "Last Quarter";
    return "Waning Crescent";
  };


  const getMoonPhase_t = () => {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const day = tomorrow.getUTCDate() + 1; // Tomorrow's date
    const month = tomorrow.getUTCMonth() + 1;
    const year = tomorrow.getUTCFullYear();
    const c = Math.floor((14 - month) / 12);
    const y = year + 4800 - c;
    const m = month + 12 * c - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const phase = (jd + 4.867) % 29.53;
    if (phase < 1 || phase > 28.53) return "New";
    if (phase < 7.38) return "Waxing Crescent";
    if (phase < 8.38) return "First Quarter";
    if (phase < 14.76) return "Waxing Gibbous";
    if (phase < 15.76) return "Full";
    if (phase < 22.14) return "Waning Gibbous";
    if (phase < 23.14) return "Last Quarter";
    return "Waning Crescent";
  };


  const getVisibility = (meters) => (meters / 1000).toFixed(1);

  const getUVIndex = () => {
    const hour = new Date().getHours();
    if (hour >= 10 && hour <= 15) return 6;
    if (hour >= 7 && hour <= 17) return 4;
    return 1;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const dewPoint = calculateDewPoint(weather.main?.temp || 0, weather.main?.humidity || 0);
  const sunrise = formatTime(weather.sys?.sunrise || 0);
  const sunset = formatTime(weather.sys?.sunset || 0);
  const uvIndex = getUVIndex();
  const visibility = getVisibility(weather.visibility || 0);
  const pressure = weather.main?.pressure || 'N/A';
  const aqiIndex = aqi?.main?.aqi;
  const aqiLevel = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqiIndex - 1] || 'N/A';

  const dewPoint_t = calculateDewPoint(tomorrowWeather.main?.temp || 0, tomorrowWeather.main?.humidity || 0);
  const sunrise_t = formatTime(tomorrowWeather.sys?.sunrise || 0);
  const sunset_t = formatTime(tomorrowWeather.sys?.sunset || 0);
  const uvIndex_t = getUVIndex();
  const visibility_t = getVisibility(tomorrowWeather.visibility || 0);
  const pressure_t = tomorrowWeather.main?.pressure || 'N/A';

  // --- Main Return UI ---
  return (
    <View style={{ flex: 1, backgroundColor: '#2e7d32' }}>
      <ScrollView
        style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressViewOffset={100}
            colors={['#2e7d32']}
          />
        }
      >
        {/* Current Weather Block */}
        <View style={{ margin: 16, backgroundColor: '#e8f5e9', borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 14, color: '#2e7d32' }}>Now</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#1b5e20' }}>{Math.round(weather.main.temp)}°</Text>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '500', color: '#2e7d32' }}>{weather.weather[0].main}</Text>
              <Text style={{ fontSize: 14, color: '#388e3c' }}>Feels like {Math.round(weather.main.feels_like)}°</Text>
            </View>
          </View>
          <Text style={{ color: '#2e7d32', marginTop: 4 }}>High: {Math.round(weather.main.temp_max)}° Low: {Math.round(weather.main.temp_min)}°</Text>
        </View>

        {/* Tab Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 8 }}>
          {['Today', 'Tomorrow'].map(tab => (
            <TouchableOpacity
              key={tab}
              // onPress={() => setActiveTab(tab)}
              onPress={async () => {
                setRefreshing(true);      // Show loader
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                setActiveTab(tab);        // Set the tab first
                setRefreshing(false);     // Hide loader
              }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeTab === tab ? '#c8e6c9' : '#f0f0f0'
              }}
            >
              <Text style={{ fontWeight: '500', color: activeTab === tab ? '#2e7d32' : '#757575' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>


        {/* Weather Info Cards */}
        {activeTab === 'Today' && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
          {[{
            icon: <Wind size={24} color="#1b5e20" />, label: 'Wind Speed', value: `${Math.round(weather.wind.speed)} km/h`
          }, {
            icon: <Droplets size={24} color="#1b5e20" />, label: 'Humidity', value: `${weather.main.humidity}%`
          }, {
            icon: <Thermometer size={24} color="#1b5e20" />, label: 'Dew Point', value: `${dewPoint}°`
          }, {
            icon: <Gauge size={24} color="#1b5e20" />, label: 'Pressure', value: `${pressure} hPa`
          }, {
            icon: <Eye size={24} color="#1b5e20" />, label: 'Visibility', value: `${visibility} km`
          }, {
            icon: <Sunrise size={24} color="#1b5e20" />, label: 'Sunrise', value: sunrise
          }, {
            icon: <Sun size={24} color="#1b5e20" />, label: 'UV Index', value: uvIndex
          }, {
            icon: <Moon size={24} color="#1b5e20" />, label: 'Moon Phase', value: getMoonPhase()
          }, {
            icon: <CloudRain size={24} color="#1b5e20" />, label: 'Condition', value: weather.weather[0].description
          }, {
            icon: <Cloud size={24} color="#1b5e20" />, label: 'Air Quality', value: aqiLevel
          }].map((item, i) => (
            <View key={i} style={{ width: '50%', padding: 8 }}>
              <View style={{ backgroundColor: '#f1f8e9', padding: 12, borderRadius: 12 }}>
                {item.icon}
                <Text style={{ color: '#2e7d32', marginTop: 4, fontWeight: 'bold' }}>{item.label}</Text>
                <Text style={{ color: '#388e3c' }}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>)}

        {/* Tomorrow Tab */}
        {activeTab === 'Tomorrow' && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
          {[{
            icon: <Wind size={24} color="#1b5e20" />, label: 'Wind Speed', value: `${Math.round(tomorrowWeather.wind.speed)} km/h`
          }, {
            icon: <Droplets size={24} color="#1b5e20" />, label: 'Humidity', value: `${tomorrowWeather.main.humidity ?? 'N/A'}%`
          }, {
            icon: <Thermometer size={24} color="#1b5e20" />, label: 'Dew Point', value: `${dewPoint_t}°`
          }, {
            icon: <Gauge size={24} color="#1b5e20" />, label: 'Pressure', value: `${pressure_t} hPa`
          }, {
            icon: <Eye size={24} color="#1b5e20" />, label: 'Visibility', value: `${visibility_t} km`
          }, {
            icon: <Sunrise size={24} color="#1b5e20" />, label: 'Sunrise', value: sunrise_t
          }, {
            icon: <Sun size={24} color="#1b5e20" />, label: 'UV Index', value: uvIndex_t
          }, {
            icon: <Moon size={24} color="#1b5e20" />, label: 'Moon Phase', value: getMoonPhase_t()
          }, {
            icon: <CloudRain size={24} color="#1b5e20" />, label: 'Condition', value: tomorrowWeather.weather[0].description || 'N/A'
          }, {
            icon: <Cloud size={24} color="#1b5e20" />, label: 'Air Quality', value: aqiLevel
          }].map((item, i) => (
            <View key={i} style={{ width: '50%', padding: 8 }}>
              <View style={{ backgroundColor: '#f1f8e9', padding: 12, borderRadius: 12 }}>
                {item.icon}
                <Text style={{ color: '#2e7d32', marginTop: 4, fontWeight: 'bold' }}>{item.label}</Text>
                <Text style={{ color: '#388e3c' }}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>)}
      </ScrollView>
    </View>
  );
}
