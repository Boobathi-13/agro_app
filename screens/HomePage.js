// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import { db } from '../firebase';
// import { ref, onValue } from 'firebase/database';

// export default function HomePage() {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const sensorRef = ref(db, 'sensorData/');
//     onValue(sensorRef, (snapshot) => {
//       const val = snapshot.val();
//       if (val) setData(val);
//     });
//   }, []);

//   return (
//     <View className="flex-1 bg-gradient-to-r from-blue-100 to-blue-200 p-6">
//       <Text className="text-3xl font-semibold text-center text-gray-900 mb-8">
//         Sensor Dashboard
//       </Text>

//       <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <View className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
//           <Text className="text-xl text-green-600 font-semibold mb-2">🌡️ Temperature</Text>
//           <Text className="text-3xl font-bold text-gray-800">{data.temperature ?? '--'} °C</Text>
//         </View>

//         <View className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
//           <Text className="text-xl text-blue-600 font-semibold mb-2">💧 Humidity</Text>
//           <Text className="text-3xl font-bold text-gray-800">{data.humidity ?? '--'}%</Text>
//         </View>

//         <View className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
//           <Text className="text-xl text-yellow-600 font-semibold mb-2">🌱 Soil Moisture</Text>
//           <Text className="text-3xl font-bold text-gray-800">{data.soilMoisture ?? '--'}</Text>
//         </View>
//       </View>
//     </View>
//   );
// }



import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const screenWidth = Dimensions.get('window').width;

export default function HomePage() {
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    soilMoisture: [],
    labels: [],
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchSensorData = () => {
    const sensorRef = ref(db, 'sensorData/');
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const newTemp = parseFloat(data.temperature);
        const newHum = parseFloat(data.humidity);
        const newSoil = data.soilMoisture;

        const limit = 10;
        setHistory((prev) => ({
          temperature: [...prev.temperature.slice(-limit + 1), newTemp],
          humidity: [...prev.humidity.slice(-limit + 1), newHum],
          soilMoisture: [...prev.soilMoisture.slice(-limit + 1), newSoil],
          labels: [...prev.labels.slice(-limit + 1), timestamp],
        }));

        // Automatically turn on or off the motor based on conditions
        handleMotorControl(newTemp, newHum, newSoil);
      }
    });
  };

  const handleMotorControl = (temperature, humidity, soilMoisture) => {
    const motorRef = ref(db, 'motor/');
  
    onValue(motorRef, (snapshot) => {
      const motorData = snapshot.val();
      if (!motorData?.manualOverride) {
        if (soilMoisture === "Dry" && temperature > 40) {
          turnOnMotor();
        } else if (soilMoisture === "Wet" || temperature <= 40) {
          turnOffMotor();
        }
      }
    }, { onlyOnce: true }); // prevent continuous listening
  };
  
  
  const turnOnMotor = () => {
    const motorRef = ref(db, 'motor/');
    set(motorRef, { status: 'ON', lastChanged: Date.now() });
  };

  const turnOffMotor = () => {
    const motorRef = ref(db, 'motor/');
    set(motorRef, { status: 'OFF', lastChanged: Date.now() });
  };

  useEffect(() => {
    fetchSensorData(); // Initial fetch
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSensorData();
    setTimeout(() => {
      setRefreshing(false);
      ToastAndroid.show("Data refreshed!", ToastAndroid.SHORT);
    }, 1000);
  }, []);

  const { temperature, humidity, soilMoisture, labels } = history;
  const latestTemp = temperature.at(-1);
  const latestHum = humidity.at(-1);
  const latestSoil = soilMoisture.at(-1);

  if (labels.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#2e7d32]">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white text-lg mt-2">Fetching Sensors...</Text>
      </View>
    );
  }

  const renderCard = (title, value, unit, styles) => (
    <View className={`${styles.bg} mb-4 rounded-2xl p-4`}>
      <Text className={`${styles.labelColor} text-sm`}>Now</Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text className={`${styles.valueColor} text-5xl font-bold`}>
          {value}{unit}
        </Text>
        <View className="items-end">
          <Text className={`${styles.titleColor} text-2xl font-medium`}>{title}</Text>
          <Text className={`${styles.subtitleColor} text-base mb-3`}>Sensor Reading</Text>
        </View>
      </View>
    </View>
  );

  const renderChart = (title, dataSet, unit, chartColors) => (
    <View className="bg-white rounded-2xl p-4 mt-6">
      <Text className={`${chartColors.labelColor} text-xl font-semibold mb-4`}>{title}</Text>
      <LineChart
        data={{ labels, datasets: [{ data: dataSet }] }}
        width={screenWidth - 54}
        height={260}
        yAxisSuffix={unit}
        chartConfig={{
          backgroundGradientFrom: chartColors.bgFrom,
          backgroundGradientTo: chartColors.bgTo,
          decimalPlaces: 1,
          color: (opacity = 1) => `${chartColors.lineColor(opacity)}`,
          labelColor: () => chartColors.labelColorCode,
          propsForDots: { r: "3", strokeWidth: "2", stroke: chartColors.dotStroke },
          propsForLabels: { fontSize: 10 },
        }}
        bezier
        style={{ borderRadius: 16 }}
        verticalLabelRotation={45}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-[#2e7d32]">
      <ScrollView
        className="flex-1 p-4 bg-white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
            progressViewOffset={100}
          />
        }
      >
        {renderCard("Temperature", latestTemp, "°", {
          bg: "bg-[#e8f5e9]",
          labelColor: "text-[#2e7d32]",
          valueColor: "text-[#1b5e20]",
          titleColor: "text-[#2e7d32]",
          subtitleColor: "text-[#388e3c]",
        })}

        {renderCard("Humidity", latestHum, "%", {
          bg: "bg-[#e3f2fd]",
          labelColor: "text-[#0d47a1]",
          valueColor: "text-[#0d47a1]",
          titleColor: "text-[#1976d2]",
          subtitleColor: "text-[#1565c0]",
        })}

        {renderCard("Soil Moisture", latestSoil, "", {
          bg: "bg-[#f1f8e9]",
          labelColor: "text-[#33691e]",
          valueColor: "text-[#33691e]",
          titleColor: "text-[#558b2f]",
          subtitleColor: "text-[#7cb342]",
        })}

        {renderChart("Temperature (°C)", temperature, "°", {
          bgFrom: "#e8f5e9",
          bgTo: "#c8e6c9",
          labelColor: "text-[#2e7d32]",
          lineColor: (opacity) => `rgba(30, 100, 50, ${opacity})`,
          labelColorCode: "#2e7d32",
          dotStroke: "#1b5e20",
        })}

        {renderChart("Humidity (%)", humidity, "%", {
          bgFrom: "#e3f2fd",
          bgTo: "#bbdefb",
          labelColor: "text-[#0d47a1]",
          lineColor: (opacity) => `rgba(13, 71, 161, ${opacity})`,
          labelColorCode: "#0d47a1",
          dotStroke: "#0d47a1",
        })}
      </ScrollView>
    </View>
  );
}
