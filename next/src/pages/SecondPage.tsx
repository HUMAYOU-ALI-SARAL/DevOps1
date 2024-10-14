'use client'
import React, { useState, useEffect } from 'react';
import { FaXTwitter } from "react-icons/fa6"; 
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { IoIosInformationCircle } from "react-icons/io";
import './style.css';

const SecondPage = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [signLoading, setSignLoading] = useState(false);
    const [otpValid, setOtpValid] = useState<boolean | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        if (code) {
            localStorage.setItem('authCode', code);
        }
    }, []);

    useEffect(() => {
        if (otp.length === 5) {
            setOtpLoading(true);
            axios.post('/api/check_referral_code', {
                referralCode: otp
            })
                .then(response => {
                    if (response.status === 200) {
                        setOtpValid(true);
                        setMessage(response.data.message);
                        localStorage.setItem('referralCode', otp);
                    } else {
                        setOtpValid(false);
                        setMessage(response.data.message || 'Invalid referral code.');
                    }
                    setOtpLoading(false);
                })
                .catch(error => {
                    setMessage("Invalid referral code.");
                    setOtpValid(false);
                    setOtpLoading(false);
                    console.error(error);
                });
        }
    }, [otp]);

    const callTwitterApi = async () => {
        setSignLoading(true);
        try {
            const apiUrl = 'https://nodejs-serverless-function-express-beryl-xi.vercel.app/api/hello';
            const response = await axios.get(apiUrl);

            if (response.data) {
                const message = response.data.message;
                if (message !== "Hello World!") {
                    setMessage(message);
                } else {
                    setMessage('');
                }

                const axiosResponse = response.data.axiosResponse;
                const newUrl = `https://api.twitter.com/oauth/authorize?${axiosResponse}`;
                window.location.href = newUrl;

                // Save the sign-in status in sessionStorage
                if (otpValid) {
                    sessionStorage.setItem('referralCode', otp);
                    sessionStorage.setItem('signInWithReferralCode', 'true');
                } else {
                    sessionStorage.setItem('signInWithReferralCode', 'false');
                }
            } else {
                console.error("Received unexpected response from API:", response);
                // If there's an unexpected response, set signInWithReferralCode to false
                sessionStorage.setItem('signInWithReferralCode', 'false');
            }
        } catch (error) {
            console.error("Error calling API:", error);
            // If there's an error, set signInWithReferralCode to false
            sessionStorage.setItem('signInWithReferralCode', 'false');
        } finally {
            setSignLoading(false);
        }
    };

    const otpInputHandler = (value: string) => {
        if (!otpLoading) {  
            setOtp(value);
            setMessage('');
            setOtpValid(null);
        }
    };

    // Determine message color based on otpValid state
    const messageColor = otpValid === true ? 'green' : otpValid === false ? 'red' : 'white';
    
    return (
        <div
            className="h-screen w-full relative"
            style={{
                backgroundImage: "url('/Images/connect_bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className='w-full h-[80vh] overflow-y-scroll md:overflow-hidden flex justify-center items-center'>
                <div className="flex flex-col justify-center items-center mb-4">
                    <img src="/Images/Logo.webp" alt="Sphera World Logo" className="w-[120px] md:w-[100px] h-[110px] md:h-[90px]" />
                    <img src="/Images/SpheraWorld.webp" alt="Sphera World Logo" className="h-6 w-[200px] md:w-[220px] m-auto mt-2 md:mt-6" />
                    <p className="text-orange text-xl md:text-3xl my-2 md:mt-6 font-jura font-semibold">HUmayou</p>

                    <div className="relative flex justify-center items-center">
                        <p className="text-white font-jura my-4 flex justify-center items-center gap-1 text-[18px]">
                            <div
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                className="relative"
                            >
                                <IoIosInformationCircle size={24} color='#FF7F2A' className='cursor-pointer' />
                                {showTooltip && (
                                    <div className="absolute top-full left-0 mt-0 w-[250px] md:w-[400px] bg-gray-800/60 backdrop-blur-sm text-white text-sm p-4 rounded-2xl border-2 border-[#FF7F2A]">
                                        <p className='text-[14px] md:text-[18px]'>
                                            Go to your settings in sphera marketplace to get your referral code
                                        </p>
                                        <a
                                            href="https://staging.spheramarket.io/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='mb-4 text-[13px] font-jura'
                                        >
                                            <p className='text-[14px] md:text-[16px] mt-2 text-[#FF7F2A]' >
                                                Go to marketplace
                                            </p>
                                        </a>
                                    </div>
                                )}
                            </div>
                            Enter referral code (optional)
                        </p>
                    </div>

                    <div className='w-[300px] md:w-[400px] my-1 md:my-3'>
                        <OtpInput
                            value={otp}
                            onChange={otpInputHandler}
                            numInputs={5}
                            containerStyle="w-full justify-around text-[#fff] "
                            renderInput={(props) =>
                                <input
                                    {...props}
                                    style={{
                                        textAlign: 'center',
                                        border: "2px solid #4D4D4D",
                                        borderRadius: '7px',
                                        background: "#191512",
                                        color: '#fff',
                                    }}
                                    required
                                    disabled={otpLoading} 
                                    className='w-[40px] md:w-[60px] h-[40px] md:h-[60px]'
                                />}
                        />
                    </div>
                    <p className='font-jura mt-2' style={{ color: messageColor }}>{message}</p>
                    <button
                        onClick={callTwitterApi}
                        disabled={signLoading}
                        className={`mt-2 md:mt-2 text-white font-jura py-2 px-4 rounded w-[100%] md:w-[400px] h-[50px] md:h-[60px] flex justify-center items-center gap-2 text-2xl`}
                        style={{
                            borderRadius: '7.441px',
                            border: '1.488px solid #FF7F2A',
                            background: 'linear-gradient(180deg, rgba(255, 127, 42, 0.07) 0%, rgba(255, 127, 42, 0.25) 100%)',
                            boxShadow: '0 4px 6px -1px rgba(255, 127, 42, 0.5), 0 2px 4px -1px rgba(255, 127, 42, 0.06)'
                        }}
                    >
                        SIGN IN USING <FaXTwitter />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SecondPage;
