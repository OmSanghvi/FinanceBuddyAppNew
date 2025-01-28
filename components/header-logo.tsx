import Link from 'next/link';
import Image from 'next/image';

/**
 * HeaderLogo component for displaying the logo in the header.
 *
 * This component renders a link to the home page with the logo image and the application name.
 * It is only visible on large screens (lg).
 *
 * @returns {JSX.Element} The rendered HeaderLogo component.
 */
export const HeaderLogo = () => {
    return(
        <Link href="/">
            <div className='items-start justify-start hidden lg:flex'>
                <Image src = "/logo.svg" alt = "Logo" height={28} width={28}/>
                <p className='font-semibold text-white text-2xl ml-2.5'>
                    Vorifi
                </p>
            </div>
        </Link>
    )
}