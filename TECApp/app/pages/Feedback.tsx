import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { insertFeedback } from '../api/requests'

const vw = Dimensions.get('window').width
const vh = Dimensions.get('window').height

export default function Feedback() {
  const [text, setText] = useState<string>()
  const [submitMessage, setSubmitMessage] = useState<string>(null)

  const handleSubmit = async () => {
    if (text) {
      insertFeedback(text)
        .then((response) => {
          if (response.success) {
            setSubmitMessage('success')
          } else {
            setSubmitMessage('fail')
          }
        })
        .catch(console.error)

      setText(null)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View style={styles.wrapper}>
        <Text style={styles.header}>Give us your feedback!</Text>
        <Text style={styles.body}>
          Let us know what changes you’d like to see in the next update:
        </Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Add your comments..."
          multiline
          inputMode="text"
          maxLength={1000}
          onChangeText={setText}
          value={text}
          onEndEditing={() => Keyboard.dismiss}
        ></TextInput>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: '#FFF', fontSize: 16 }}>Submit</Text>
        </TouchableOpacity>
        {submitMessage === null ? (
          <></>
        ) : submitMessage === 'success' ? (
          <View style={styles.successMessage}>
            <Text style={{ fontWeight: 400 }}>
              Message received! Thank you for your feedback.
            </Text>
          </View>
        ) : (
          <View style={styles.failMessage}>
            <Text style={{ fontWeight: 400 }}>
              Something went wrong. Please try again later.
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: vw,
    // backgroundColor: "red",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 0.2 * vh,
    gap: 20,
  },

  header: {
    color: '#000',
    fontFamily: 'Brix Sans',
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  body: {
    color: '#000',
    fontFamily: 'Brix Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  inputBox: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '80%',
    height: 150,
    padding: 15,
  },

  submitButton: {
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#266297',
  },

  successMessage: {
    borderRadius: 4,
    backgroundColor: '#17EBA0',
    opacity: 0.75,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  failMessage: {
    borderRadius: 4,
    backgroundColor: '#ed5240',
    opacity: 0.75,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
})
