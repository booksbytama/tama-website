import { FaInstagram, FaFacebook, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='border-t font-body '>
      <div className='bg-blue-50 '>
        <div className='max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:items-start text-center rounded-lg'>
          <div className='flex-shrink-0 w-24 h-24 md:w-28 md:h-28 my-auto'>
            <img
              src='/assets/images/billyconnect.png'
              alt='Ocean Illustration'
              className='object-contain w-full h-full'
              loading='lazy'
            />
          </div>

          <div className='max-w-5xl mx-auto flex flex-col items-center text-center flex-grow '>
            {/* Heading */}
            <h2 className='text-lg md:text-xl font-semibold text-blue-600 mb-2'>
              Let’s Stay Connected!
            </h2>

            {/* Description */}
            <p className='text-base md:text-lg leading-relaxed max-w-2xl mb-4'>
              Follow us for behind-the-scenes updates, ocean facts, and sneak
              peeks:
            </p>

            {/* Social Icons */}
            <div className='flex justify-center gap-8 text-blue-600'>
              {[
                {
                  href: 'https://instagram.com/booksbytama',
                  label: 'Instagram',
                  icon: FaInstagram,
                },
                {
                  href: 'https://facebook.com/booksbytama',
                  label: 'Facebook',
                  icon: FaFacebook,
                },
                {
                  href: 'https://www.pinterest.com/booksbytama',
                  label: 'Pinterest',
                  icon: FaPinterest,
                },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='flex flex-col items-center group'
                >
                  <Icon
                    size={24}
                    className='group-hover:text-blue-800 transition-transform duration-200 group-hover:scale-110'
                  />
                  <span className='text-xs mt-1 block'>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='w-full border-t pt-3 pb-3 text-sm text-center text-gray-600'>
        © 2025 Tama M. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
