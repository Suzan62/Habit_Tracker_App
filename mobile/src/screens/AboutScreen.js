import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

const AboutScreen = ({ navigation }) => {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appIcon}>🎯</Text>
        <Text style={styles.appTitle}>HabitTracker</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* Mission Statement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          To empower individuals to build positive habits and transform their lives through 
          consistent daily actions. We believe that small, consistent changes lead to 
          extraordinary results.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📝</Text>
            <Text style={styles.featureText}>Easy habit tracking and monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureText}>Achievement system with rewards</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>Social features to connect with friends</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Detailed analytics and progress tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureText}>Smart reminders and notifications</Text>
          </View>
        </View>
      </View>

      {/* Development Team */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Development Team</Text>
        <View style={styles.teamCard}>
          <Text style={styles.developerName}>Vaibhav</Text>
          <Text style={styles.developerRole}>Lead Developer & Designer</Text>
          <Text style={styles.developerDescription}>
            Passionate about creating apps that help people improve their daily lives 
            through technology and positive habit formation.
          </Text>
        </View>
      </View>

      {/* Technology Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built With</Text>
        <View style={styles.techStack}>
          <View style={styles.techItem}>
            <Text style={styles.techName}>React Native</Text>
            <Text style={styles.techDescription}>Mobile App Framework</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>.NET Core</Text>
            <Text style={styles.techDescription}>Backend API</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>PostgreSQL</Text>
            <Text style={styles.techDescription}>Database</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techName}>JWT</Text>
            <Text style={styles.techDescription}>Authentication</Text>
          </View>
        </View>
      </View>

      {/* Contact & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Support</Text>
        <View style={styles.contactItems}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('mailto:support@habittracker.com')}
          >
            <Text style={styles.contactIcon}>📧</Text>
            <View>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactText}>support@habittracker.com</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('https://github.com/vaibhav/habit-tracker')}
          >
            <Text style={styles.contactIcon}>🔗</Text>
            <View>
              <Text style={styles.contactTitle}>GitHub Repository</Text>
              <Text style={styles.contactText}>View source code and contribute</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.legalItems}>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Open Source Licenses</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for habit builders everywhere
        </Text>
        <Text style={styles.copyright}>
          © 2024 HabitTracker. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    textAlign: 'justify',
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
  },
  teamCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  developerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  developerRole: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 10,
  },
  developerDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  techStack: {
    gap: 10,
  },
  techItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  techName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  techDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  contactItems: {
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  legalItems: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  legalText: {
    fontSize: 16,
    color: '#34495e',
  },
  arrow: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 10,
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default AboutScreen;
