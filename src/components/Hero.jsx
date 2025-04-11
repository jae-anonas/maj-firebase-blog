import image from "../assets/8767132.jpg";
import heroImg from "../assets/118-macbook.png";

const Hero = () => {
  return (
    <div className='prose prose-stone mx-5 my-12 flex max-w-7xl flex-col items-center md:flex-row lg:mx-auto'>
      <div className='mx-auto w-full max-w-[90%] md:mr-3 md:max-w-[46%]'>
        <h1 className=' bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text py-3 text-3xl font-extrabold text-transparent lg:text-5xl'>
          Welcome to Maj's blog!
        </h1>
        <p className='text-gray-400 md:pt-4 lg:text-lg'>
          This is where I share stuff I want to share with the world.
        </p>
      </div>
      <div className='mx-auto max-w-[70%] bg-transparent md:max-w-[50%]'>
        <img
          loading='lazy'
          className='w-full rounded-lg bg-black '
          src={heroImg}
          alt=''
        />
      </div>
    </div>
  );
};

export default Hero;
