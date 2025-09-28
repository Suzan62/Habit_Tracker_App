import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IntroductionScreen = ({ onComplete }) => {
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const introPages = [
    {
      id: 1,
      title: "Track Your Habits",
      subtitle: "Build Better Habits, Build Better You",
      description: "Create and monitor your daily habits with ease. Set goals and track your progress every day.",
      icon: "📝",
      backgroundColor: "#4A90E2",
    },
    {
      id: 2,
      title: "Earn Achievements",
      subtitle: "Stay Motivated",
      description: "Unlock badges and earn points for your consistency. Celebrate your milestones and achievements.",
      icon: "🏆",
      backgroundColor: "#50C878",
    },
    {
      id: 3,
      title: "Connect with Friends",
      subtitle: "Stay Accountable",
      description: "Add friends and motivate each other on your journey. Share your progress and compete in friendly challenges.",
      icon: "👥",
      backgroundColor: "#FF6B6B",
    },
    {
      id: 4,
      title: "Smart Analytics",
      subtitle: "Track Your Progress",
      description: "Get detailed insights about your habits with beautiful charts and analytics. See how far you've come.",
      icon: "📊",
      backgroundColor: "#9B59B6",
    },
  ];

  const handleScroll = (event) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const goToPage = (pageIndex) => {
    scrollViewRef.current?.scrollTo({
      x: pageIndex * width,
      animated: true,
    });
    setCurrentPage(pageIndex);
  };

  const nextPage = () => {
    if (currentPage < introPages.length - 1) {
      goToPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const skipIntro = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      {/* Header with Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={skipIntro} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {introPages.map((page, index) => (
          <View 
            key={page.id} 
            style={[styles.page, { backgroundColor: page.backgroundColor }]}
          >
            <View style={styles.contentContainer}>
              {/* Icon/Image */}
              <View style={styles.iconContainer}>
                <Text style={styles.pageIcon}>{page.icon}</Text>
              </View>

              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={styles.pageTitle}>{page.title}</Text>
                <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
                <Text style={styles.pageDescription}>{page.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Page Indicators */}
        <View style={styles.pagination}>
          {introPages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive,
              ]}
              onPress={() => goToPage(index)}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentPage < introPages.length - 1 ? (
            <View style={styles.navigationButtons}>
              <TouchableOpacity 
                style={styles.previousButton} 
                onPress={() => goToPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <Text style={[
                  styles.previousButtonText,
                  currentPage === 0 && styles.buttonDisabled
                ]}>Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.nextButton} onPress={nextPage}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.getStartedButton} onPress={onComplete}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 50,
  },
  pageIcon: {
    fontSize: 120,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  pageSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.9,
    fontWeight: '500',
  },
  pageDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 25,
  },
  buttonContainer: {
    minHeight: 50,
    justifyContent: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  previousButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  nextButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default IntroductionScreen;
