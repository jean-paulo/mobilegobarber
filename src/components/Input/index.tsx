import React, {
  useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core'; // useField é pra registrar um campo do form
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps{
    name: string;
    icon: string;
    containerStyle?: {}; //eslint-disable-line
}

interface inputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

/* O componente React.fc não aceita a propriedade ref, e como precisamos acessa-la precisamos
 de outro tipo de componente */
const Input: React.RefForwardingComponent< InputRef ,InputProps> = ({ name, icon, containerStyle = {}, ...rest }, ref) => {//eslint-disable-line
  const inputElementRef = useRef<any>(null); //eslint-disable-line

  const {
    registerField, defaultValue = '', fieldName, error,
  } = useField(name);
  const inputValueRef = useRef<inputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    // se tiver algum valor dentro dessa variavel coloca true, se não false.
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) { //eslint-disable-line
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
