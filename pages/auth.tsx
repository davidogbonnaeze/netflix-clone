import React, {useCallback, useState} from 'react';
import Image from "next/image";
import Input from "../components/Input";
import axios from "axios";
import { signIn } from "next-auth/react";
import {useRouter} from "next/router";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';



function Auth() {
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [variant, setVariant] = useState('login')

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) =>  currentVariant === 'login'?  'register' : 'login')
    }, [])


    const login = useCallback( async () => {
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/'
            });
            await router.push('/profiles');
        } catch (e) {
            console.log(e)
        }

    }, [email, password, router])

    const register = useCallback(async () => {
        try {
            await axios.post('/api/register', {
                email,
                name,
                password
            });
            await login();
        } catch (error){
            console.log(error);
        }

    }, [email, name, password, login])



    return (
        <>
            <div className="w-full h-full bg-[url('/images/hero.png')] bg-center bg-fixed bg-no-repeat bg-cover">
                <div className="bg-black w-full h-full lg:bg-opacity-50">
                    <nav className="px-12 py-12">
                        <img src="/images/logo.png" alt="Logo" className="h-12"/>
                    </nav>
                    <div className="flex justify-center">
                        <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full" >
                            <div className="text-white font-semibold mb-8 text-4xl">
                                {variant === 'login' ? 'Sign in' : 'Register'}
                            </div>
                            <div className="flex flex-col gap-4">
                                {
                                    variant === 'register' &&
                                    <Input
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setName(event.target.value)}}
                                        value={name}
                                        label='Username'
                                        id='name'
                                    />
                                }
                                <Input
                                    onChange={(event : React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value)}}
                                    value={email}
                                    label='Email'
                                    id='email'
                                    type='email'
                                />
                                <Input
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value)}}
                                    value={password}
                                    label='Password'
                                    id='password'
                                    type='password'
                                />
                                <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 rounded-md w-full text-white mt-10 hover:bg-red-700">{variant === 'login' ? 'Login' : 'Sign up'}</button>
                                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                                    <div onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                        <FcGoogle size={32} />
                                    </div>
                                    <div onClick={() => signIn('github', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                        <FaGithub size={32} />
                                    </div>
                                </div>
                                <p className="text-neutral-500 mt-12">
                                    {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
                                    <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">{variant === 'login' ? 'Create an account' : 'Login'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;