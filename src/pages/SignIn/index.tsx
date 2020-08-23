import React, { useCallback, useRef } from 'react';
import {
  Image, View, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core'; // Métodos que temos disponivel quando queremos manipular o form de maneira direta
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import logoimg from '../../assets/logo.png';
import {
  Container,
  Title, ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

interface SignInFormData {
    email: string;
    password: string;
  }

const SignIn: React.FC = () => {
  // Criamos a ref para manipular um elemento de uma forma direta, não através de algum evento
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSignIn = useCallback(async (data: SignInFormData) => {//eslint-disable-line
    try {
      /* zera os erros pq se tiver dado erro e depois concertar o erro ainda continuaria em tela */
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      // Mostra o erro de todos os campos, não aborta no primeiro erro que aparecer
      await schema.validate(data, {
        abortEarly: false,
      });

      // Faz o Login
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        console.log(errors);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, cheque as credenciais');
    }
  },
  [signIn]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoimg} />

            <View><Title>Faça seu logon</Title></View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                    formRef.current?.submitForm(); //eslint-disable-line
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm(); //eslint-disable-line
              }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => { console.log('ok'); }}>
              <ForgotPasswordText>
                Esqueci minha senha.
              </ForgotPasswordText>
            </ForgotPassword>
          </Container>

        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>
          Criar uma conta
        </CreateAccountButtonText>
      </CreateAccountButton>

    </>
  );
};

export default SignIn;
