  // import React, { useEffect, useState } from 'react';
  // import { View, Text, TouchableOpacity } from 'react-native';
  // import { db } from '../firebase';
  // import { ref, onValue, set } from 'firebase/database';

  // export default function MotorControlPage() {
  //   const [status, setStatus] = useState('OFF');

  //   useEffect(() => {
  //     const motorRef = ref(db, 'motor/status');
  //     onValue(motorRef, (snapshot) => {
  //       setStatus(snapshot.val());
  //     });
  //   }, []);

  //   const toggleMotor = async () => {
  //     const newStatus = status === 'ON' ? 'OFF' : 'ON';
  //     await set(ref(db, 'motor/'), { status: newStatus });
  //   };

  //   return (
  //     <View className="flex-1 bg-white p-5 items-center justify-center">
  //       <Text className="text-2xl font-bold text-green-700 mb-6">Motor Control</Text>

  //       <TouchableOpacity
  //         onPress={toggleMotor}
  //         className={`px-6 py-3 rounded-2xl shadow-lg ${
  //           status === 'ON' ? 'bg-red-500' : 'bg-green-500'
  //         }`}
  //       >
  //         <Text className="text-white text-xl">{status === 'ON' ? 'Turn OFF' : 'Turn ON'}</Text>
  //       </TouchableOpacity>

  //       <Text className="mt-4 text-lg">Current Status: <Text className="font-bold">{status}</Text></Text>
  //     </View>
  //   );
  // }





// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
// import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
// import { db } from '../firebase';
// import { ref, onValue, set, push, get } from 'firebase/database';
// import { formatDistanceToNow, differenceInHours, startOfMinute, subHours, addMinutes, format, isAfter } from 'date-fns';

// export default function MotorControlPage() {
//   const [status, setStatus] = useState('OFF');
//   const [lastChanged, setLastChanged] = useState(null);
//   const [timeDiff, setTimeDiff] = useState(0);
//   const [timeDisplay, setTimeDisplay] = useState('');
//   const [statusHistory, setStatusHistory] = useState([]);

//   const pulseAnim = new Animated.Value(0);

//   useEffect(() => {
//     if (status === 'ON') {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 0.3,
//             duration: 1200,
//             easing: Easing.inOut(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     } else {
//       pulseAnim.setValue(0);
//     }
//   }, [status]);

//   useEffect(() => {
//     if (lastChanged) {
//       const interval = setInterval(() => {
//         const now = new Date();
//         const last = new Date(lastChanged);
//         const diffHours = differenceInHours(now, last);
//         const normalized = Math.min(diffHours / 24, 1);
//         setTimeDiff(normalized);
//         setTimeDisplay(formatDistanceToNow(last, { addSuffix: true }));
//       }, 1000 * 60);

//       return () => clearInterval(interval);
//     }
//   }, [lastChanged]);

//   useEffect(() => {
//     const motorRef = ref(db, 'motor/');
//     const historyRef = ref(db, 'motorHistory/');
//     onValue(motorRef, (snap) => {
//       const data = snap.val();
//       if (data) {
//         setStatus(data.status);
//         setLastChanged(data.lastChanged);
//       }
//     });
//     get(historyRef).then((snap) => {
//       if (snap.exists()) {
//         const history = Object.entries(snap.val()).map(([id, entry]) => ({
//           id,
//           status: entry.status,
//           timestamp: entry.timestamp,
//         }));
//         setStatusHistory(history.sort((a, b) => a.timestamp - b.timestamp));
//       }
//     });
//   }, []);

//   const toggleMotor = async () => {
//     const newStatus = status === 'ON' ? 'OFF' : 'ON';
//     const now = Date.now();
//     await set(ref(db, 'motor/'), { status: newStatus, lastChanged: now });
//     await push(ref(db, 'motorHistory/'), { status: newStatus, timestamp: now });
//     setStatus(newStatus);
//     setLastChanged(now);
//   };

//   const getTimeArc = () => {
//     const radius = 28;
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference * (1 - timeDiff);
//     return {
//       strokeDasharray: circumference,
//       strokeDashoffset: offset,
//     };
//   };

//   const generateGraphData = () => {
//     const now = new Date();
//     const intervals = [];
//     const start = subHours(now, 3); // 3 hours ago
//     for (let i = 0; i < 6; i++) {
//       const startInterval = addMinutes(start, i * 30);
//       const endInterval = addMinutes(startInterval, 30);
//       const entries = statusHistory.filter(
//         (item) => {
//           const t = new Date(item.timestamp);
//           return isAfter(t, startInterval) && !isAfter(t, endInterval);
//         }
//       );
//       const latest = entries[entries.length - 1];
//       intervals.push({
//         label: format(startInterval, 'HH:mm'),
//         status: latest ? latest.status : 'OFF', // default to OFF
//       });
//     }
//     return intervals;
//   };

//   const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
//   const opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

//   const graphData = generateGraphData();

//   return (
//     <ScrollView className="bg-gray-900 flex-1">
//       <View className="w-full items-center pt-[10%] pb-12">
//         <Text className="text-3xl font-bold text-gray-200 mb-6">Motor Control</Text>

//         {/* Circle Timer */}
//         <View className="relative mb-10" style={{ width: '70%', aspectRatio: 1 }}>
//           <Svg height="100%" width="100%" viewBox="0 0 60 60" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
//             <Circle cx="30" cy="30" r="28" stroke="#2d3748" strokeWidth="4" fill="none" />
//             <Circle
//               cx="30"
//               cy="30"
//               r="28"
//               stroke={status === 'ON' ? '#4ADE80' : '#f56565'}
//               strokeWidth="4"
//               fill="none"
//               strokeLinecap="round"
//               {...getTimeArc()}
//             />
//           </Svg>

//           {/* Toggle Button */}
//           <Animated.View
//             className="absolute w-full h-full items-center justify-center"
//             style={{ transform: [{ scale }], opacity }}
//           >
//             <TouchableOpacity onPress={toggleMotor} className="bg-gray-800 w-[70%] aspect-square rounded-full shadow-2xl items-center justify-center">
//               <View className="items-center justify-center">
//                 <View className={`w-4 h-12 rounded-full mb-1 ${status === 'ON' ? 'bg-green-400' : 'bg-red-500'}`} />
//                 <View
//                   className={`w-24 h-24 rounded-full border-4 absolute ${status === 'ON' ? 'border-green-400' : 'border-red-500'}`}
//                   style={{ borderTopColor: 'transparent', transform: [{ rotate: '135deg' }] }}
//                 />
//               </View>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>

//         <Text className="text-xl text-gray-300">
//           Status: <Text className={`${status === 'ON' ? 'text-green-400' : 'text-red-400'} font-semibold`}>{status}</Text>
//         </Text>

//         {lastChanged && (
//           <Text className="text-sm text-gray-400 mt-1">
//             Last changed: {format(new Date(lastChanged), 'PPpp')}
//           </Text>
//         )}

//         {/* Timeline Graph */}
//         <View className="w-[90%] mt-10">
//           <Text className="text-xl font-bold text-gray-300 mb-3">Last 3 Hours Timeline</Text>
//           <View className="bg-gray-800 rounded-lg p-4 items-center">
//             <Svg height="100" width="100%" viewBox={`0 0 ${graphData.length * 20} 60`}>
//               {graphData.map((item, index) => {
//                 const x = index * 20 + 10;
//                 const isOn = item.status === 'ON';
//                 return (
//                   <React.Fragment key={index}>
//                     <Rect
//                       x={x}
//                       y={isOn ? 20 : 35}
//                       width={10}
//                       height={isOn ? 30 : 15}
//                       fill={isOn ? '#4ADE80' : '#f56565'}
//                       rx={1}
//                     />
//                     <SvgText
//                       x={x + 5}
//                       y={60}
//                       fontSize="4"
//                       fill="#cbd5e1"
//                       textAnchor="middle"
//                     >
//                       {item.label}
//                     </SvgText>
//                   </React.Fragment>
//                 );
//               })}
//             </Svg>
//             <Text className="text-xs text-gray-400 mt-2">Each bar = 30 minutes</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView, RefreshControl, ToastAndroid } from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { db } from '../firebase';
import { ref, onValue, set, push, get, update } from 'firebase/database';
import { formatDistanceToNow, differenceInHours, subHours, addMinutes, format, isAfter } from 'date-fns';

export default function MotorControlPage() {
  const [status, setStatus] = useState('OFF');
  const [lastChanged, setLastChanged] = useState(null);
  const [timeDiff, setTimeDiff] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState('');
  const [statusHistory, setStatusHistory] = useState([]);
  const [manualOverride, setManualOverride] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  // Add this flag to prevent infinite loops during updates
  const [isUpdating, setIsUpdating] = useState(false);
  // Add refresh state
  const [refreshing, setRefreshing] = useState(false);

  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    if (status === 'ON') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [status]);

  useEffect(() => {
    if (lastChanged) {
      const interval = setInterval(() => {
        const now = new Date();
        const last = new Date(lastChanged);
        const diffHours = differenceInHours(now, last);
        const normalized = Math.min(diffHours / 24, 1);
        setTimeDiff(normalized);
        setTimeDisplay(formatDistanceToNow(last, { addSuffix: true }));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [lastChanged]);

  // Function to fetch data from Firebase
  const fetchData = useCallback(async () => {
    try {
      const motorRef = ref(db, 'motor/');
      const historyRef = ref(db, 'motorHistory/');
      
      // Get motor status data
      const motorSnapshot = await get(motorRef);
      if (motorSnapshot.exists()) {
        const data = motorSnapshot.val();
        setStatus(data.status);
        setLastChanged(data.lastChanged);
        
        if (data.manualOverride !== undefined) {
          setManualOverride(data.manualOverride);
        }
        
        if (data.autoMode !== undefined) {
          setAutoMode(data.autoMode);
        }
      }
      
      // Get history data
      const historySnapshot = await get(historyRef);
      if (historySnapshot.exists()) {
        const history = Object.entries(historySnapshot.val()).map(([id, entry]) => ({
          id,
          status: entry.status,
          timestamp: entry.timestamp,
        }));
        setStatusHistory(history.sort((a, b) => a.timestamp - b.timestamp));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      ToastAndroid.show("Failed to refresh data", ToastAndroid.SHORT);
    }
  }, []);

  useEffect(() => {
    const motorRef = ref(db, 'motor/');
    const historyRef = ref(db, 'motorHistory/');

    let lastStatus = null;

    const unsubscribe = onValue(motorRef, (snap) => {
      // Skip processing if we're currently updating the database ourselves
      if (isUpdating) return;
      
      const data = snap.val();
      if (data) {
        if (data.status !== lastStatus) {
          lastStatus = data.status;
          setStatus(data.status);
          setLastChanged(data.lastChanged);
        } else {
          setStatus(data.status);
        }

        // Only update these values if they're different from our local state
        if (data.manualOverride !== undefined && data.manualOverride !== manualOverride) {
          setManualOverride(data.manualOverride);
        }

        if (data.autoMode !== undefined && data.autoMode !== autoMode) {
          setAutoMode(data.autoMode);
        }
      }
    });

    get(historyRef).then((snap) => {
      if (snap.exists()) {
        const history = Object.entries(snap.val()).map(([id, entry]) => ({
          id,
          status: entry.status,
          timestamp: entry.timestamp,
        }));
        setStatusHistory(history.sort((a, b) => a.timestamp - b.timestamp));
      }
    });

    return () => unsubscribe();
  }, [isUpdating, manualOverride, autoMode]);  // Add dependencies to prevent stale closures

  // Implement the onRefresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
      ToastAndroid.show("Data refreshed!", ToastAndroid.SHORT);
    }).catch(() => {
      setRefreshing(false);
    });
  }, [fetchData]);

  const toggleMotor = async () => {
    if (!manualOverride || autoMode) return;

    const motorRef = ref(db, 'motor/');
    const snapshot = await get(motorRef);
    const motorData = snapshot.val();
    const currentStatus = motorData?.status || 'OFF';
    const now = Date.now();

    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';

    await set(motorRef, {
      ...motorData,
      status: newStatus,
      lastChanged: now,
    });

    await push(ref(db, 'motorHistory/'), {
      status: newStatus,
      timestamp: now,
    });

    setStatus(newStatus);
    setLastChanged(now);
  };

  const toggleManualOverride = async () => {
    try {
      setIsUpdating(true);
      const newValue = !manualOverride;
      
      // Update local state first
      setManualOverride(newValue);
      
      // If turning manual override on, make sure auto mode is off
      if (newValue && autoMode) {
        setAutoMode(false);
      }

      const motorRef = ref(db, 'motor/');
      const snapshot = await get(motorRef);
      let motorData = snapshot.val() || {};
      
      // Prepare complete update object to avoid partial updates
      await update(ref(db, 'motor/'), {
        ...motorData,
        manualOverride: newValue,
        autoMode: newValue ? false : motorData.autoMode,
      });
    } finally {
      // Always reset the updating flag when done
      setIsUpdating(false);
    }
  };

  const toggleAutoMode = async () => {
    try {
      setIsUpdating(true);
      const newValue = !autoMode;
      
      // Update local state first
      setAutoMode(newValue);
      
      // If turning auto mode on, make sure manual override is off
      if (newValue && manualOverride) {
        setManualOverride(false);
      }

      const motorRef = ref(db, 'motor/');
      const snapshot = await get(motorRef);
      let motorData = snapshot.val() || {};
      
      // Prepare complete update object to avoid partial updates
      await update(ref(db, 'motor/'), {
        ...motorData,
        autoMode: newValue,
        manualOverride: newValue ? false : motorData.manualOverride,
      });
    } finally {
      // Always reset the updating flag when done
      setIsUpdating(false);
    }
  };

  const getTimeArc = () => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - timeDiff);
    return {
      strokeDasharray: circumference,
      strokeDashoffset: offset,
    };
  };

  const generateGraphData = () => {
    const now = new Date();
    const intervals = [];
    const start = subHours(now, 3);
    for (let i = 0; i < 6; i++) {
      const startInterval = addMinutes(start, i * 30);
      const endInterval = addMinutes(startInterval, 30);
      const entries = statusHistory.filter((item) => {
        const t = new Date(item.timestamp);
        return isAfter(t, startInterval) && !isAfter(t, endInterval);
      });
      const latest = entries[entries.length - 1];
      intervals.push({
        label: format(startInterval, 'HH:mm'),
        status: latest ? latest.status : 'OFF',
      });
    }
    return intervals;
  };

  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const graphData = generateGraphData();

  return (
    <ScrollView 
      className="bg-gray-900 flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4ADE80']}
          progressBackgroundColor="#2d3748"
          progressViewOffset={80}
        />
      }
    >
      <View className="w-full items-center pt-[10%] pb-12">
        <Text className="text-3xl font-bold text-gray-200 mb-6">Motor Control</Text>

        <View className="relative mb-10" style={{ width: '70%', aspectRatio: 1 }}>
          <Svg height="100%" width="100%" viewBox="0 0 60 60" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
            <Circle cx="30" cy="30" r="28" stroke="#2d3748" strokeWidth="4" fill="none" />
            <Circle
              cx="30"
              cy="30"
              r="28"
              stroke={status === 'ON' ? '#4ADE80' : '#f56565'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              {...getTimeArc()}
            />
          </Svg>

          <Animated.View
            className="absolute w-full h-full items-center justify-center"
            style={{ transform: [{ scale }], opacity }}
          >
            <TouchableOpacity
              onPress={toggleMotor}
              className={`bg-gray-800 w-[70%] aspect-square rounded-full shadow-2xl items-center justify-center ${(!manualOverride || autoMode) && 'opacity-50'}`}
              disabled={!manualOverride || autoMode}
            >
              <View className="items-center justify-center">
                <View className={`w-4 h-12 rounded-full mb-1 ${status === 'ON' ? 'bg-green-400' : 'bg-red-500'}`} />
                <View
                  className={`w-24 h-24 rounded-full border-4 absolute ${status === 'ON' ? 'border-green-400' : 'border-red-500'}`}
                  style={{ borderTopColor: 'transparent', transform: [{ rotate: '135deg' }] }}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text className="text-xl text-gray-300">
          Status: <Text className={`${status === 'ON' ? 'text-green-400' : 'text-red-400'} font-semibold`}>{status}</Text>
        </Text>

        <View className="mt-6 flex-row space-x-6">
          <TouchableOpacity
            onPress={toggleManualOverride}
            className={`px-4 py-2 mr-2 rounded-full ${manualOverride ? 'bg-green-600' : 'bg-gray-600'}`}
            disabled={isUpdating}
          >
            <Text className="text-white font-semibold">Manual Override: {manualOverride ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleAutoMode}
            className={`px-4 py-2 ml-2 rounded-full ${autoMode ? 'bg-yellow-500' : 'bg-gray-600'}`}
            disabled={isUpdating}
          >
            <Text className="text-white font-semibold">Automatic Mode: {autoMode ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>

        {lastChanged && (
          <Text className="text-sm text-gray-400 mt-8">
            Last changed: {format(new Date(lastChanged), 'PPpp')}
          </Text>
        )}

        <View className="w-[90%] mt-10">
          <Text className="text-xl font-bold text-gray-300 mb-3">Last 3 Hours Timeline</Text>
          <View className="bg-gray-800 rounded-lg pt-4 items-center mt-2">
            <Svg height="100" width="300" viewBox="0 0 300 100">
              {graphData.map((entry, index) => {
                const barWidth = 40;
                const spacing = 10;
                const x = index * (barWidth + spacing);

                return (
                  <React.Fragment key={index}>
                    <Rect
                      x={x}
                      y={10}
                      width={barWidth}
                      height={40}
                      fill={entry.status === 'ON' ? '#4ADE80' : '#f56565'}
                    />
                    <SvgText
                      x={x + barWidth / 2}
                      y={65}
                      fontSize={10}
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#ccc"
                    >
                      {entry.label}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}