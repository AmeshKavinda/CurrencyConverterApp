import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Picker,
  Button,
  Alert,
  Switch,
} from 'react-native';

const App = () => {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const apiKey = 'ed0ba73e56d9a282408842e913490e1a';
  const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;

  useEffect(() => {
    fetchExchangeRate();
  }, [baseCurrency]);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.result === 'success') {
        setExchangeRate(data.rates);
      } else {
        Alert.alert('Error', 'Failed to fetch exchange rates.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred.');
    }
  };

  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    if (exchangeRate && targetCurrency) {
      const rate = exchangeRate[targetCurrency];
      if (rate) {
        setConvertedAmount((parseFloat(amount) * rate).toFixed(2));
      } else {
        Alert.alert('Error', 'Invalid target currency.');
      }
    } else {
      Alert.alert('Error', 'Exchange rates not available.');
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
      ]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        Currency Converter
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
            color: isDarkMode ? '#FFFFFF' : '#000000',
            borderColor: isDarkMode ? '#666666' : '#CCCCCC',
          },
        ]}
        placeholder="Enter amount"
        placeholderTextColor={isDarkMode ? '#CCCCCC' : '#666666'}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.pickerContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>From:</Text>
        <Picker
          selectedValue={baseCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setBaseCurrency(itemValue)}>
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          <Picker.Item label="JPY" value="JPY" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>To:</Text>
        <Picker
          selectedValue={targetCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setTargetCurrency(itemValue)}>
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          <Picker.Item label="JPY" value="JPY" />
        </Picker>
      </View>

      <Button title="Convert" onPress={convertCurrency} />

      {convertedAmount ? (
        <Text style={[styles.result, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          Converted Amount: {convertedAmount} {targetCurrency}
        </Text>
      ) : null}

      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default App;
