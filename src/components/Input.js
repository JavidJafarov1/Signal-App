
// import React, { useState, forwardRef, useRef } from 'react';
// import {
//     View,
//     TextInput,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     Platform,
// } from 'react-native';
// import { Color } from '../assets/color/Color';

// // You'll need to install react-native-vector-icons or use your preferred icon library
// // For this example, I'm using text symbols as fallback
// const EyeIcon = ({ visible }) => (
//     <Text style={styles.icon}>{visible ? '👁️' : '🙈'}</Text>
// );

// const SearchIcon = () => (
//     <Text style={styles.icon}>🔍</Text>
// );

// const ClearIcon = () => (
//     <Text style={styles.icon}>✕</Text>
// );

// const CustomInput = forwardRef(({
//     type = 'text',
//     placeholder = '',
//     label = '',
//     value = '',
//     onChangeText = () => { },
//     onClear = () => { },
//     editable = true,
//     error = '',
//     style = {},
//     containerStyle = {},
//     showClearButton = false,
//     multiline = false,
//     numberOfLines = 1,
//     ...props
// }, ref) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [isFocused, setIsFocused] = useState(false);
//     const inputRef = useRef(null);

//     const isPassword = type === 'password';
//     const isSearch = type === 'search';
//     const hasValue = value && value.length > 0;

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleClear = () => {
//         onChangeText('');
//         if (onClear) onClear();
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     };

//     const handleFocus = (e) => {
//         setIsFocused(true);
//         if (props.onFocus) props.onFocus(e);
//     };

//     const handleBlur = (e) => {
//         setIsFocused(false);
//         if (props.onBlur) props.onBlur(e);
//     };

//     const getBorderColor = () => {
//         if (error) return '#ef4444';
//         if (isFocused) return '#3b82f6';
//         return '#d1d5db';
//     };

//     return (
//         <View style={[styles.container, containerStyle]}>
//             {/* Static Label */}
//             {label && (
//                 <Text style={[styles.label, error && styles.labelError]}>
//                     {label}
//                 </Text>
//             )}

//             <View
//                 style={[
//                     styles.inputContainer,
//                     { borderColor: getBorderColor() },
//                     error && styles.errorContainer,
//                     !editable && styles.disabledContainer,
//                 ]}
//             >
//                 {/* Search Icon */}
//                 {isSearch && (
//                     <View style={styles.leftIcon}>
//                         <SearchIcon />
//                     </View>
//                 )}

//                 <View style={styles.inputWrapper}>
//                     {/* Text Input */}
//                     <TextInput
//                         ref={(input) => {
//                             inputRef.current = input;
//                             if (ref) {
//                                 if (typeof ref === 'function') {
//                                     ref(input);
//                                 } else {
//                                     ref.current = input;
//                                 }
//                             }
//                         }}
//                         style={[
//                             styles.textInput,
//                             isSearch && styles.searchInput,
//                             multiline && styles.multilineInput,
//                             style,
//                         ]}
//                         value={value}
//                         onChangeText={onChangeText}
//                         onFocus={handleFocus}
//                         onBlur={handleBlur}
//                         placeholder={placeholder}
//                         placeholderTextColor="#9ca3af"
//                         secureTextEntry={isPassword && !showPassword}
//                         editable={editable}
//                         multiline={multiline}
//                         numberOfLines={numberOfLines}
//                         {...props}
//                     />
//                 </View>

//                 {/* Right Icons */}
//                 <View style={styles.rightIcons}>
//                     {/* Password Toggle */}
//                     {isPassword && (
//                         <TouchableOpacity
//                             onPress={togglePasswordVisibility}
//                             style={styles.iconButton}
//                             activeOpacity={0.7}
//                         >
//                             <EyeIcon visible={showPassword} />
//                         </TouchableOpacity>
//                     )}

//                     {/* Clear Button */}
//                     {isSearch && hasValue && showClearButton && (
//                         <TouchableOpacity
//                             onPress={handleClear}
//                             style={styles.iconButton}
//                             activeOpacity={0.7}
//                         >
//                             <ClearIcon />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>

//             {/* Error Message */}
//             {error && (
//                 <Text style={styles.errorText}>{error}</Text>
//             )}
//         </View>
//     );
// });

// CustomInput.displayName = 'CustomInput';

// const styles = StyleSheet.create({
//     container: {
//         marginVertical: 8,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: Color.gray,
//         minHeight: 56,
//         paddingHorizontal: 16,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//             },
//             android: {
//                 elevation: 2,
//             },
//         }),
//     },
//     errorContainer: {
//         borderColor: '#ef4444',
//     },
//     disabledContainer: {
//         backgroundColor: '#f9fafb',
//         borderColor: '#e5e7eb',
//     },
//     leftIcon: {
//         marginRight: 12,
//     },
//     inputWrapper: {
//         flex: 1,
//         position: 'relative',
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#374151',
//         marginBottom: 6,
//     },
//     labelError: {
//         color: '#ef4444',
//     },
//     textInput: {
//         fontSize: 16,
//         color: '#000',
//         paddingVertical: 16,
//         paddingHorizontal: 0,
//         textAlignVertical: 'center',
//     },
//     searchInput: {
//         paddingVertical: 16,
//     },
//     multilineInput: {
//         textAlignVertical: 'top',
//         paddingTop: 16,
//         paddingBottom: 16,
//     },
//     rightIcons: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     iconButton: {
//         padding: 8,
//         marginLeft: 4,
//     },
//     icon: {
//         fontSize: 20,
//         color: '#6b7280',
//     },
//     errorText: {
//         marginTop: 4,
//         fontSize: 12,
//         color: '#ef4444',
//         marginLeft: 4,
//     },
// });


// export default CustomInput




// // const [normalText, setNormalText] = useState('')
// // const [password, setPassword] = useState('');
// // const [searchText, setSearchText] = useState('');
// // const [emailError, setEmailError] = useState('');

// // const validateEmail = (email) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (email && !emailRegex.test(email)) {
// //         setEmailError('Please enter a valid email address');
// //     } else {
// //         setEmailError('');
// //     }
// // };

// //   <CustomInput
// //     label="Full Name"
// //     value={normalText}
// //     onChangeText={setNormalText}
// //     placeholder="Enter your full name"
// //   />

// //   {/* Email Input with Validation */}
// //   <CustomInput
// //     type="email"
// //     label="Email Address"
// //     value={normalText}
// //     onChangeText={(text) => {
// //       setNormalText(text);
// //       validateEmail(text);
// //     }}
// //     error={emailError}
// //     keyboardType="email-address"
// //     autoCapitalize="none"
// //   />

// //   {/* Password Input */}
// //   <CustomInput
// //     type="password"
// //     label="Password"
// //     value={password}
// //     onChangeText={setPassword}
// //     placeholder="Enter your password"
// //   />

// //   {/* Search Input */}
// //   <CustomInput
// //     type="search"
// //     placeholder="Search..."
// //     value={searchText}
// //     onChangeText={setSearchText}
// //     showClearButton={true}
// //     onClear={() => console.log('Search cleared')}
// //   />

// //   {/* Multiline Input */}
// //   <CustomInput
// //     label="Description"
// //     value={normalText}
// //     onChangeText={setNormalText}
// //     placeholder="Enter description"
// //     multiline={true}
// //     numberOfLines={4}
// //   />

// //   {/* Disabled Input */}
// //   <CustomInput
// //     label="Disabled Field"
// //     value="This field is disabled"
// //     editable={false}
// //   />




// import React from 'react';
// import { View, TextInput, StyleSheet } from 'react-native';
// import { Color } from '../assets/color/Color';
// import { scale } from 'react-native-size-matters';

// const InputComponent = ({
//     placeholder,
//     value,
//     onChangeText,
//     secureTextEntry = false,
//     keyboardType = 'default',
//     style = {},
// }) => {
//     return (
//         <View style={[styles.inputContainer, style]}>
//             <TextInput
//                 style={styles.input}
//                 placeholder={placeholder}
//                 placeholderTextColor={Color.text}
//                 value={value}
//                 onChangeText={onChangeText}
//                 secureTextEntry={secureTextEntry}
//                 keyboardType={keyboardType}
//             />
//         </View>
//     );
// };

// export default InputComponent;

// const styles = StyleSheet.create({
    
// });



import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Color } from '../assets/color/Color';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

const InputComponent = ({
    type = 'text',
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
}) => {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (type === 'email') {
            setIsValid(emailRegex.test(value));
        } else if (type === 'password') {
            setIsValid(passwordRegex.test(value));
        } else {
            setIsValid(true);
        }
    }, [value, type]);

    const showValidation = (type === 'email' || type === 'password') && value.length > 0;

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, !isValid && showValidation && styles.invalidInput]}
                placeholder={placeholder}
                placeholderTextColor="#ffffffaa"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={type === 'email' ? 'email-address' : 'default'}
            />
            {showValidation && (
                <Text style={[styles.validationText, { color: isValid ? 'lightgreen' : 'red' }]}>
                    {isValid ? '✅' : '❌'}
                </Text>
            )}
        </View>
    );
};

export default InputComponent;

const styles = StyleSheet.create({
inputContainer: {
        width: '100%',
        backgroundColor: Color.gray, 
    },
    input: {
        height: scale(46),
        paddingHorizontal: scale(10),
        color: Color.text,
    },
    invalidInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    validationText: {
        position: 'absolute',
        right: 10,
        top: '35%',
        fontSize: 16,
    },
});
