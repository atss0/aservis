import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../styles/Colors';
import { FontFamily, FontSizes } from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  icon?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View 
        style={[
          styles.inputContainer, 
          isFocused && styles.inputFocused,
          error ? styles.inputError : null
        ]}
      >
        {icon && (
          <Iconify 
            icon={icon} 
            size={wScale(20)} 
            color={isFocused ? Colors.primary.main : Colors.neutral.grey4} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral.grey4}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Iconify 
              icon={isPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'} 
              size={wScale(20)} 
              color={Colors.neutral.grey4}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hScale(16),
    width: '100%',
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
    marginBottom: hScale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.grey3,
    borderRadius: wScale(12),
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: wScale(16),
    height: hScale(56),
  },
  inputFocused: {
    borderColor: Colors.primary.main,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: Colors.status.error,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.regular),
    color: Colors.neutral.grey5,
  },
  icon: {
    marginRight: wScale(12),
  },
  eyeIcon: {
    padding: wScale(4),
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: wScale(FontSizes.small),
    color: Colors.status.error,
    marginTop: hScale(4),
    marginLeft: wScale(4),
  },
});

export default CustomInput;
