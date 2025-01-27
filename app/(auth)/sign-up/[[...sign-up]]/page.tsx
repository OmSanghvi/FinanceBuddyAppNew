"use client"
import Image from "next/image";
import {Loader2} from 'lucide-react'
import { SignUp, ClerkLoaded,ClerkLoading } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

/**
 * The main page component for the sign-up page.
 *
 * This component renders a sign-up form using Clerk, with a loading state and a button to navigate to the home page.
 *
 * @returns {JSX.Element} The rendered sign-up page component.
 */
export default function Page() {
    const router = useRouter();
    return (
        <div className = "min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className = "h-full bg-white lg:flex flex-col items-center justify-center px-4">
                <div className = "text-center space-y-4 pt-16">
                    <h1 className = "font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className = "text-base text-[#7E8CA0]">
                        Log in or Create account to get back to your dashboard
                    </p>
                </div>
                <div className = "flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignUp/>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className='animate-spin text-muted-foreground'/>
                    </ClerkLoading>
                </div>
            </div>
            <div className='h-full bg-blue-600 lg:flex items-center justify-center'>
                <Image src = "/logo.svg" height = {100} width = {100} alt = "Logo"/>
            </div>
            {/* Button in the bottom left */}
            <Button
                className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => router.push('/home')}
            >
                Go to Home
            </Button>
        </div>
    );
}