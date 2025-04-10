import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import { COLORS, SCREEN_WIDTH } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to Wanderlyze',
    subtitle: 'Explore hidden gems, exciting destinations, and unforgettable adventures around you.',
    image: require('../../../assets/images/OnboardImages/OnBoardImage1.png'),
  },
  {
    key: '2',
    title: 'Plan Your Trip',
    subtitle: 'Create custom itineraries with just a few taps.',
    image: require('../../../assets/images/OnboardImages/OnBoardImage2.png'),
  },
  {
    key: '3',
    title: 'Let’s Get Started!',
    subtitle: 'Pack your bags and start exploring the world now.',
    image: require('../../../assets/images/OnboardImages/OnBoardImage3.png'),
  },
];

const OnBoardScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" delay={200}>
        <FastImage
          source={item.image}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animatable.View>
      <Animatable.Text animation="fadeIn" delay={400} style={styles.title}>
        {item.title}
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={600} style={styles.subtitle}>
        {item.subtitle}
      </Animatable.Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />

      {/* Dots */}
      <View style={styles.dotsWrapper}>
        {slides.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
        })}
      </View>

      {/* Buttons */}
      {currentIndex === slides.length - 1 ? (
        <Animatable.View animation="fadeInUp" delay={100} style={styles.buttonWrapper}>
          <Pressable
            style={styles.getStartedBtn}
            onPress={() => navigation.replace('SignIn')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </Pressable>
        </Animatable.View>
      ) : (
        <View style={styles.navButtons}>
          <Pressable
            onPress={() => navigation.replace('SignIn')}
            style={styles.glassBtn}
          >
            <Text style={styles.glassBtnText}>Skip</Text>
          </Pressable>

          <Pressable onPress={nextSlide} style={styles.glassBtn}>
            <Text style={styles.glassBtnText}>Next</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default OnBoardScreen;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'Poppins-Regular',
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 6,
  },
  navButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  glassBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 5,
  },
  glassBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.3,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  getStartedBtn: {
    width: width * 0.6,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  getStartedText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
});
