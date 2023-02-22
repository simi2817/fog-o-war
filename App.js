import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PROVIDER_GOOGLE, Polyline, Polygon, Geojson } from "react-native-maps";

import MapView from "react-native-maps";
import { TurfWorker } from "./turf";
import { Locator } from "./Locator";

import * as Location from "expo-location";

import { mapStyle } from "./MapStyling";

export default function App() {
  const [location, setLocation] = useState(null);
  const [locationErrorMessage, setLocationErrorMessage] = useState(null);
  const [revealedFog, setRevealedFog] = useState(null);

  const locator = new Locator();
  const turfWorker = new TurfWorker();

  useEffect(() => {
    locator.requestLocationPermissions()
      .catch((err) => {
        setLocationErrorMessage(err);
      })

    locator.getCurrentPositionAsync()
      .then((newLocation) => {

        // console.log(newLocation, '<-- newLocation');
        setLocation(newLocation);

        const revealedFog = turfWorker.generateNewFog(newLocation);
        const revealedFog2 = turfWorker.uncoverFog(newLocation, revealedFog);

        setRevealedFog(revealedFog2);
      })
      .catch((err) => {
        console.log(err);
      })

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      }, (changedLocation) => {
        // console.log('<<<<<<<< changedLocation >>>>>>>', changedLocation);
        //  const revealedFog = turfWorker.generateNewFog(changedLocation);
        setLocation(changedLocation);
        
        const revealedFog2 = turfWorker.uncoverFog(changedLocation, revealedFog);
        setRevealedFog(revealedFog2);

      });

      //Get DATA from DB here,
      //If no previous data is available then generate new fog.
      
      //Generate new fog

  }, []);

  // console.log('<<<<< location >>>>>>>', location);

  
  if (locationErrorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Loading location...{location}</Text>
      </View>
    );
  }

  if (location) {
    return (
      <View style={styles.container}>

        {/* For debugging only, print the state with a button */}
        <Pressable style={styles.button} onPress={printState}>
          <Text style={styles.text}>Print React state</Text>
        </Pressable>

        <Text>Fog-O-War</Text>
        <MapView
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          // customMapStyle={mapStyle}
          mapPadding={{
            top: 30,
          }}
        >

          {
            revealedFog ?
              <Geojson
                geojson={{
                  features: [revealedFog]
                }}
                fillColor='rgba(0, 156, 0, 0.5)'
                strokeColor="green"
                strokeWidth={4}
              />
              : null
          }


        </MapView>
        <StatusBar style="auto" />
      </View>
    );
  }

  function printState() {
    console.log(JSON.stringify(revealedFog), '<-- revealedCoords')
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    height: "90%",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }
});
